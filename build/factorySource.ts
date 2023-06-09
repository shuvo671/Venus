const sampleAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"setStateByowner","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"setStateByAnyone","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"_state","type":"uint256"}]}],"data":[{"key":1,"name":"owner","type":"uint256"}],"events":[{"name":"StateChange","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"owner","type":"uint256"},{"name":"state","type":"uint256"}]} as const

export const factorySource = {
    Sample: sampleAbi
} as const

export type FactorySource = typeof factorySource
export type SampleAbi = typeof sampleAbi
