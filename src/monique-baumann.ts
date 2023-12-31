import { sleep, Logger, ethers } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Helper } from "./helper.ts"
import { Bollinger } from "./bollinger.ts"

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
    sellFreedomCash = "Sell Freedom Cash"
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
            MoniqueBaumann.instance = new MoniqueBaumann(broker, logger, interestedIn)
        }
        return MoniqueBaumann.instance
    }

    private readonly freedomCashRocks = true
    private partyIsOn = false
    private roundIsActive = false
    private broker: Broker
    private logger: Logger
    private bollinger: Bollinger
    private interestedIn: EDataTypes[] = []
    private executedActionsCounters: IActionsCounters[] = []

    private constructor(broker: Broker, logger: Logger, interestedIn: EDataTypes[]) {
        this.logger = logger
        this.broker = broker
        this.bollinger = new Bollinger(27, logger)
        this.interestedIn= interestedIn
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
                const index = Math.round((Math.random() * ((6 - 1) - 0) + 0))
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
            this.executedActionsCounters.push({action: action, count: 1})
        } else {
            executedActionCounter.count = executedActionCounter.count + 1
        }
        this.logger.info(this.executedActionsCounters)
    }
    private async execute(action: EActions): Promise<void> {

        this.countActions(action)

        switch (action) {
            case EActions.voteForInvestment: {
                return this.broker.voteFor("investmentBet", UNI, 9)
            }
            case EActions.voteForPublicGood: {
                return this.broker.voteFor("publicGoodsFunding", OPDonations, 999)
            }
            case EActions.voteForGeoCash: {
                return this.broker.voteFor("geoCashing", VITALIK, 999, "geil")
            }
            case EActions.executeCommunityInvestment: {
                const id = await this.broker.iCIDAt(UNI)
                const candidate = await this.broker.investmentCandidatesAt(id)
                const delta = candidate[1] - candidate[2]
                if (delta > BigInt(0)) {
                    return this.broker.executeCommunityInvestment(UNI, 3000, 70)
                } else {
                    this.logger.warning(`makes no sense atm because delta: ${delta}`)
                    return
                }
            }
            case EActions.takeProfits: {
                const balance = await (await await this.broker.getAssetContract(UNI)).balanceOf(FC)
                const oneThird = (balance / BigInt(3))
                if (oneThird < BigInt(1000000000000000)) {
                    this.logger.warning(`not taking profits for now due to low balance`)
                    return
                } else {
                    const buyPrice = await this.broker.getBuyPrice(1)
                    const sellPrice = await this.broker.getSellPrice()
                    if (buyPrice - (buyPrice*0.09) < sellPrice) {
                        return this.broker.takeProfits(UNI, oneThird, 3000, 30)
                    } else {
                        this.logger.warning(`no need to take profits atm`)
                        return
                    }
                }
            }            
            case EActions.sellFreedomCash: {
                const balance = await this.broker.balanceOf()
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

export const FC = "0xdB8042acaEa8d5656aDE8126c250789bfc023639"
export const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
export const CULT = "0xf0f9D895aCa5c8678f706FB8216fa22957685A13"
export const POD = "0xE90CE7764d8401d19ed3733a211bd3b06c631Bc0"
export const SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
export const OPDonations = "0x2D1bEB3e41D90d7F9756e92c3061265206a661A2"
export const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
export const CENTRALIZEDFRAUD = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"


