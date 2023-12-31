import { sleep, Logger } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Helper } from "./helper.ts"
import { Bollinger } from "./bollinger.ts"
import { Checker } from "./checker.ts"

export enum EMode {
    actionRandom,
    actionSpecific,
    bollingerReal,
    bollingerDemo
}

export enum EActions {
    voteForInvestment = "Vote for Investment",
    voteForPublicGood = "Vote for Public Good",
    voteForGeoCash = "Vote for GeoCash",
    executeCommunityInvestment = "Execute Community Investment",
    takeProfits = "Take Profits",
    sellFreedomCash = "Sell Freedom Cash",
    swipSwapV3Service = "Utilize the swip swap service",
    sendETHWithMessage = "Send Ether with Message",
}

export enum EDataTypes {
    masterData,
    gamingData,
    pricingData,
    budgetData,
    operationalData
}

interface IActionsCounters{
    action: EActions,
    count: number
}

export class MoniqueBaumann {

    public static instance

    public static async getInstance(interestedIn: EDataTypes[]): Promise<void> {
        if (MoniqueBaumann.instance === undefined) {
            const logger = await Helper.getLogger()
            const helper = await Helper.getInstance()
            const broker = await Broker.getInstance()
            const checker = await Checker.getInstance()
            MoniqueBaumann.instance = new MoniqueBaumann(broker, logger, checker, interestedIn)
        }
        return MoniqueBaumann.instance
    }

    private readonly freedomCashRocks = true
    private partyIsOn = false
    private roundIsActive = false
    private broker: Broker
    private logger: Logger
    private bollinger: Bollinger
    private checker: Checker
    private interestedIn: EDataTypes[] = []
    private executedActionsCounters: IActionsCounters[] = []

    private constructor(broker: Broker, logger: Logger, checker: Checker, interestedIn: EDataTypes[]) {
        this.logger = logger
        this.broker = broker
        this.bollinger = new Bollinger(27, logger)
        this.interestedIn= interestedIn
        this.checker = checker
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
        if (minHistoryLength > 0 && spreadFactor > 0) {
            if (mode === EMode.bollingerDemo) {
                await this.playBollinger(minHistoryLength, spreadFactor, mode)
            } else if (mode === EMode.bollingerReal) {
                await this.playBollinger(minHistoryLength, spreadFactor, mode)
            }
        } else if (minHistoryLength === 0 && spreadFactor === 0) {
            if (mode === EMode.actionRandom) {
                const index = Math.round((Math.random() * ((8 - 1) - 0) + 0))
                const randomAction = Object.values(EActions)[index]
                await this.execute(randomAction)
            } else if (mode === EMode.actionSpecific) {
                await this.execute(action)
            }
        }
        await this.broker.logFundamentals(this.interestedIn)
    }
    private async playBollinger(minHistoryLength: number, factor: number, mode: EMode) {
        this.logger.info("\n\n*************************** Pulses Of Freedom ***************************")
        await this.broker.logFundamentals()
        let price: number
        if (mode === EMode.bollingerReal) {
            price = await this.broker.getBuyPrice(Helper.convertToWei(1))
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
            this.executedActionsCounters.push({action: action, count: 1})
        } else {
            executedActionCounter.count = executedActionCounter.count + 1
        }
        this.logger.info(JSON.stringify(this.executedActionsCounters))
    }
    private async execute(action: EActions): Promise<void> {
        await this.checker.checkConsistency()

        this.countActions(action)

        switch (action) {
            case EActions.voteForInvestment: {
                return this.broker.voteFor("investmentBet", Helper.UNI, 9999)
            }
            case EActions.voteForPublicGood: {
                return this.broker.voteFor("publicGoodsFunding", Helper.OPDonations, 999)
            }
            case EActions.voteForGeoCash: {
                return this.broker.voteFor("geoCashing", Helper.VITALIK, 999, "geil")
            }
            case EActions.sendETHWithMessage: {
                return this.broker.sendETHWithMessage(Helper.VITALIK, "Hello Free World", 0.000009)
            }
            case EActions.swipSwapV3Service: {
                return this.broker.swipSwapV3Service(Helper.WETH, Helper.UNI, 0.009, 3000, 30)
            }
            case EActions.takeProfits: {
                return this.broker.takeProfits(Helper.UNI, 1, 3000, 70)
            }
            case EActions.executeCommunityInvestment: {
                const highestSoFar = await this.broker.addressOfHighestSoFarInvestment()
                const id = await this.broker.iCIDAt(highestSoFar)
                const candidate = await this.broker.investmentCandidatesAt(id)
                console.log(candidate)
                console.log(typeof(candidate))
                const delta = candidate[1] - candidate[2]
                if (delta > BigInt(0)) {
                    return this.broker.executeCommunityInvestment(Helper.UNI, 3000, 70)
                } else {
                    this.logger.warning(`makes no sense atm because delta: ${delta}`)
                    return
                }
            }
            case EActions.sellFreedomCash: {
                return this.broker.sellFreedomCash(999)
            }
            default: throw new Error(`unknown action: ${action} (typeOfAction ${typeof (action)})`)
        }

    }

    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}