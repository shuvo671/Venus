import {expect } from "chai";
import { Account } from "everscale-standalone-client";
import { Contract, getRandomNonce, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";

let sample: Contract<FactorySource["Sample"]>;
let signer: Signer;
let userAccount: Account;



async function deployAccount (signer: Signer, balance: number) { 
  const {account} = await locklift. factory.accounts.addNewAccount({

  type: WalletTypes.EverWallet,
  
  //Value which will send to the new account from a giver
  
  value: toNano (balance),
  
  //owner publicKey
  
  publicKey: signer.publicKey,
  
  nonce: getRandomNonce(),
  });
  return account;
}


describe("Test Sample contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    let accountKeyPair = await locklift.keystore.getSigner("2") 
    userAccount = await deployAccount (accountKeyPair!, 5);
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const sampleData = await locklift.factory.getContractArtifacts("Sample");

      expect(sampleData.code).not.to.equal(undefined, "Code should be available");
      expect(sampleData.abi).not.to.equal(undefined, "ABI should be available");
      expect(sampleData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      const INIT_STATE = 0;
      const deployerSigner = (await locklift.keystore.getSigner ("16"))!; 
      const { contract } = await locklift.factory.deployContract({
        contract: "Sample",
        publicKey: deployerSigner.publicKey,
        initParams: {
          owner: `0x${signer.publicKey}`,
        },
        constructorParams: {
          _state: INIT_STATE,
        },
        value: locklift.utils.toNano(2),
      });
      sample = contract;

      expect(
        await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Interact with contract with external message and correct pubkey", async function () {
      const NEW_STATE = 1;

      await sample.methods.setStateByowner({ _state: NEW_STATE })
      .sendExternal({ publicKey: signer.publicKey });

      const response = await sample.methods.getDetails({}).call();

      expect(Number(response._state))
      .to.be.equal(NEW_STATE, "Wrong state");
    });

    it("Interact with contract with external message, correct pubkey and wrong new state",async function () {
     let response = await sample.methods.getDetails({}).call();
     const OLD_STATE = Number(response._state);
     const NEW_STATE = 101;
     await sample.methods.setStateByowner({ _state: NEW_STATE }) 
        .sendExternal({ publicKey: signer.publicKey });
     response = await sample.methods.getDetails({}).call();
     expect (Number(response._state))
       .to.be.equal(OLD_STATE, "Wrong state");
    });

   
      it("Interact with contract with internal message and wrong amount", async function (){
        let response = await sample.methods.getDetails({}).call();
      const OLD_STATE = Number(response._state);
      const NEW_STATE = 3;
      locklift.tracing.setAllowedCodesForAddress( sample.address, { compute: [102] }); 
      const {traceTree} = await locklift.tracing.trace(
      sample.methods.setStateByAnyone({ _state: NEW_STATE }) 
      .send({ from: userAccount.address, amount: toNano (0.5) })
      );
      await traceTree?.beautyPrint();
      expect(traceTree).to.have.error(102);
      response = await sample.methods.getDetails({}).call();


    expect (Number(response._state)) .to.be.equal(OLD_STATE, "Wrong state"); });


      it("Interact with contract with internal message and correct amount", async function(){
       const NEW_STATE = 4;
      const {traceTree} = await locklift.tracing.trace(
      sample.methods.setStateByAnyone({ _state: NEW_STATE }) 
      .send({ from: userAccount.address, amount: toNano (1) }) 
      );
      await traceTree?.beautyPrint();
      const response = await sample.methods.getDetails({}).call();
      expect (Number(response._state))
      .to.be.equal(NEW_STATE, "Wrong state");
      });

  });
});
