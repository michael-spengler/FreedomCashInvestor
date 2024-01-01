import { sleep, Logger, ethers } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Bollinger } from "./bollinger.ts"
import { getContract, EDataTypes, IActionsCounters, EMode, EActions, FC } from "./constants-types-infrastructure.ts"
import { MoniqueBaumann } from "./monique-baumann.ts"

export class MoniqueBollinger extends MoniqueBaumann {

    public static instance

    public static async getInstance(interestedIn: EDataTypes[]): Promise<void> {
        if (MoniqueBaumann.instance === undefined) {
            const minLevelForConsole = 'DEBUG'
            const minLevelForFile = 'WARNING'
            const fileName = "./warnings-errors.txt"
            const pureInfo = true // leaving out e.g. the time info
            const logger = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
            const provider = new ethers.JsonRpcProvider(Broker.getProviderURL(logger))
            const contract = await getContract(FC, provider)
            const broker = await Broker.getInstance(logger, contract, provider)
            MoniqueBaumann.instance = new MoniqueBaumann(broker, logger, provider, contract, interestedIn)
        }
        return MoniqueBaumann.instance
    }

    private readonly freedomCashRocks = true
    private partyIsOn = false
    private roundIsActive = false
    private broker: Broker
    private logger: Logger
    private provider: any
    private contract: any
    private bollinger: Bollinger
    private interestedIn: EDataTypes[] = []
    private executedActionsCounters: IActionsCounters[] = []

    protected constructor(broker: Broker, logger: Logger, provider: any, contract: any, interestedIn: EDataTypes[]) {
        super(broker, logger, provider, contract, interestedIn)
        this.logger = logger
        this.broker = broker
        this.bollinger = new Bollinger(27, logger)
        this.interestedIn = interestedIn
        this.provider = provider
        this.contract = contract
    }

    public async play(sleepTime: number, minHistoryLength: number, spreadFactor: number, action: EActions, mode: EMode) {
        if (this.partyIsOn === true) { throw Error("Already Playing") }
        this.partyIsOn = true
        while (this.freedomCashRocks && !this.roundIsActive) { // protecting against too low sleepTime value
            this.roundIsActive = true
            try {
                await this.playRound(minHistoryLength, spreadFactor, action, mode)
            } catch (error) {
                this.logger.error(error)
            }
            await sleep(sleepTime)
            this.roundIsActive = false
        }
    }
    private async playRound(minHistoryLength: number, spreadFactor: number, action: EActions, mode: EMode): Promise<void> {
        if (mode === EMode.bollingerDemo) {
            await this.playBollinger(minHistoryLength, spreadFactor, mode)
        } else if (mode === EMode.bollingerReal) {
            await this.playBollinger(minHistoryLength, spreadFactor, mode)
        } else {
            this.logger.error(`I only work in Bollinger Modes`)
        }

        await this.broker.logFundamentals(this.interestedIn, FC)
    }
    private async playBollinger(minHistoryLength: number, factor: number, mode: EMode) {
        this.logger.info("\n\n*************************** Pulses Of Freedom ***************************")
        await this.broker.logFundamentals()
        let price: number
        if (mode === EMode.bollingerReal) {
            price = await this.broker.getBuyPrice(ethers.parseEther("1"))
        } else {
            price = Math.round((Math.random() * (81 - 9) + 9))
        }
        this.bollinger.addToPriceHistory(price)
        const investmentDecision = this.bollinger.getInvestmentDecision(minHistoryLength, factor)
        if (investmentDecision == "buy") {
            if (mode === EMode.bollingerDemo) {
                this.logger.info("not really buying because we are in demo mode")
            } else if (mode === EMode.bollingerReal) {
                await this.buy()
            }
        } else if (investmentDecision == "sell") {
            await this.sell()
        }
        return
    }
    private countActions(action: EActions) {
        const executedActionCounter = this.executedActionsCounters.filter((e => e.action === action))[0]
        if (executedActionCounter === undefined) {
            this.executedActionsCounters.push({ action: action, count: 1 })
        } else {
            executedActionCounter.count = executedActionCounter.count + 1
        }
        this.logger.debug(this.executedActionsCounters)
    }
    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}
