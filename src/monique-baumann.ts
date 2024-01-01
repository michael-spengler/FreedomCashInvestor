import { sleep, Logger, ethers } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Bollinger } from "./bollinger.ts"
import { EDataTypes, IActionsCounters, EActions, EMode, FC, WETH, UNI, OPDonations, VITALIK } from "./constants-types-infrastructure.ts"

export class MoniqueBaumann {

    public static instance

    public static async getInstance(interestedIn: EDataTypes[]): Promise<void> {
        if (MoniqueBaumann.instance === undefined) {
            const minLevelForConsole = 'DEBUG'
            const minLevelForFile = 'WARNING'
            const fileName = "./warnings-errors.txt"
            const pureInfo = true // leaving out e.g. the time info
            const logger = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
            const provider = new ethers.JsonRpcProvider(Broker.getProviderURL(logger))
            const contract = await MoniqueBaumann.getContract(FC, provider)
            const broker = await Broker.getInstance(logger, contract, provider)
            MoniqueBaumann.instance = new MoniqueBaumann(broker, logger, provider, contract, interestedIn)
        }
        return MoniqueBaumann.instance
    }

    public static async getContract(asset: string, provider: any): Promise<any> {
        const abi = JSON.parse(Deno.readTextFileSync('./freedomcash-abi.json'))
        return new ethers.Contract(asset, abi, await provider.getSigner())
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
    protected async playRound(minHistoryLength: number, spreadFactor: number, action: EActions, mode: EMode): Promise<void> {
        await this.execute(action)
        await this.broker.logFundamentals(this.interestedIn, FC)
    }

    protected countActions(action: EActions) {
        const executedActionCounter = this.executedActionsCounters.filter((e => e.action === action))[0]
        if (executedActionCounter === undefined) {
            this.executedActionsCounters.push({ action: action, count: 1 })
        } else {
            executedActionCounter.count = executedActionCounter.count + 1
        }
        this.logger.debug(this.executedActionsCounters)
    }
    protected async execute(action: EActions): Promise<void> {
        this.logger.info(action)

        this.countActions(action)

        switch (action) {
            case EActions.voteForInvestment: {
                return this.broker.voteFor("investmentBet", UNI, 9999)
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
                const poolAddress = await this.broker.getPoolAddress(WETH, UNI, 3000)
                const price = await this.broker.getPriceForInvestment(UNI, poolAddress)
                const amountOutMinimum = await this.broker.getAmountOutMinimum(WETH, BigInt(99 * 10 ** 15), price, 120)
                const investmentBudget = await this.broker.investmentBudget()
                const delta = candidate[1] - candidate[2]
                this.logger.warning(`investmentBudget: ${investmentBudget} price: ${price} amountOutMinimum: ${amountOutMinimum} delta: ${delta}`)
                if (delta > BigInt(0)) {
                    return this.broker.executeCommunityInvestment(UNI, 3000, 120)
                } else {
                    this.logger.warning(`makes no sense atm because delta: ${delta}`)
                    return
                }
                return
            }
            case EActions.takeProfits: {
                const investmentContract = await MoniqueBaumann.getContract(UNI, this.provider)
                const balance = await investmentContract.balanceOf(FC)
                let decimalsOfAsset = await investmentContract.decimals()
                const oneThird = (balance / BigInt(3))
                const amountInWei = BigInt(oneThird) * (BigInt(10) ** decimalsOfAsset)
                if (oneThird < BigInt(1000000000000000)) {
                    this.logger.warning(`not taking profits for now due to low balance`)
                    return
                } else {
                    const buyPrice = await this.broker.getBuyPrice(1)
                    const sellPrice = await this.broker.getSellPrice()
                    if (sellPrice < buyPrice) {
                        return this.broker.takeProfits(UNI, WETH, oneThird, 3000, 30)
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
