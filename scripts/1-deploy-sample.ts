import { Address } from "locklift";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const { contract: sample, tx } = await locklift.factory.deployContract({
    contract: "Sample",
    publicKey: signer.publicKey,
    initParams: {
      owner: `0x${signer.publicKey}`,
    },
    constructorParams: {
      _state: 0,
      _root: new Address ("0:593c78bd8697947bf885742c2593226419d35ee10de994751dce9e28c0522aba")
    },
    value: locklift.utils.toNano(5),
  });

  console.log(`Sample deployed at: ${sample.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
