import { Logger, ethers } from "../deps.ts"
import { Broker } from "./broker.ts"
import { getProviderURL, EActions, EDataTypes, getContract, VITALIK, UNI, OPDonations, WETH, FC } from "./constants-types-infrastructure.ts"
import { MoniqueBaumann } from "./monique-baumann.ts"

export class MoniqueBohr extends MoniqueBaumann {

    public static instance

    public static async getInstance(interestedIn: EDataTypes[]): Promise<void> {
        if (MoniqueBohr.instance === undefined) {
            const minLevelForConsole = 'DEBUG'
            const minLevelForFile = 'WARNING'
            const fileName = "./warnings-errors.txt"
            const pureInfo = true // leaving out e.g. the time info
            const logger = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
            const provider = new ethers.JsonRpcProvider(getProviderURL(logger))
            const contract = await getContract(FC, provider)
            const broker = await Broker.getInstance(logger, contract, provider)
            MoniqueBohr.instance = new MoniqueBohr(broker, logger, provider, contract, interestedIn)
        }
        return MoniqueBohr.instance
    }

    private broker: Broker
    private logger: Logger
    private provider: any
    private contract: any
    private interestedIn: EDataTypes[] = []

    protected constructor(broker: Broker, logger: Logger, provider: any, contract: any, interestedIn: EDataTypes[]) {
        super(broker, logger, provider, contract, interestedIn)
        this.logger = logger
        this.broker = broker
        this.interestedIn = interestedIn
        this.provider = provider
        this.contract = contract
    }
    public async play(action: EActions) {
        await super.execute(action)
        await this.broker.logFundamentals(this.interestedIn, FC)
    }
}