import { sleep, Logger, ethers } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Bollinger } from "./bollinger.ts"
import { getProviderURL, getContract, EDataTypes, IActionsCounters, EActions, EMode, FC, WETH, UNI, OPDonations, VITALIK, CENTRALIZEDFRAUD } from "./constants-types-infrastructure.ts"
import { getLogger } from "./constants-types-infrastructure.ts"

export class MoniqueBaumann {

    public static instance

    public static async getInstance(interestedIn: EDataTypes[]): Promise<void> {
        if (MoniqueBaumann.instance === undefined) {
            const logger = await getLogger()
            const provider = new ethers.JsonRpcProvider(getProviderURL(logger))
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
    }
    protected async execute(action: EActions): Promise<void> {

        this.countActions(action)

        let transaction: any
        switch (action) {
            case EActions.voteForInvestment: {
                transaction = await this.broker.voteFor("investmentBet", UNI, 9999)
                break
            }
            case EActions.voteForPublicGood: {
                transaction = await this.broker.voteFor("publicGoodsFunding", FC, 999)
                break
            }
            case EActions.voteForGeoCash: {
                transaction = await this.broker.voteFor("geoCashing", FC, 999, "geil")
                break
            }
            case EActions.executeCommunityInvestment: {
                const investment = UNI
                const id = await this.broker.iCIDAt(investment)
                const candidate = await this.broker.investmentCandidatesAt(id)
                const poolAddress = await this.broker.getPoolAddress(WETH, investment, 3000)
                const price = await this.broker.getPriceForInvestment(investment, poolAddress)
                const delta = candidate[1] - candidate[2]
                if (delta > BigInt(0)) {
                    transaction = await this.broker.executeCommunityInvestment(investment, 3000, 120)
                    break
                } else {
                    this.logger.warning(`makes no sense atm because delta: ${delta}`)
                    return
                }
            }
            case EActions.takeProfits: {
                const investment = UNI
                const investmentContract = await getContract(investment, this.provider)
                const balance = await investmentContract.balanceOf(FC)
                let decimalsOfAsset = await investmentContract.decimals()
                const oneThird = (balance / BigInt(3))
                if (oneThird < BigInt(1000000)) {
                    this.logger.warning(`not taking profits for now due to low ${investment} balance of ${balance}`)
                    return
                } else {
                    const sellAmount = BigInt(10**18)
                    // 154915529986723658084
                    // 1000000000000000000
                    this.logger.warning(`taking profits by selling ${sellAmount} ${investment} at current balance of ${balance}`)
                    const buyPrice = await this.broker.getBuyPrice(1)
                    const sellPrice = await this.broker.getSellPrice()
                    if (sellPrice < buyPrice) {
                        transaction = await this.broker.takeProfits(investment, WETH, sellAmount, 3000, 120)
                        break
                    } else {
                        this.logger.warning(`no need to take profits atm`)
                        return
                    }
                }
            }
            case EActions.sellFreedomCash: {
                let balance = await this.broker.balanceOf(FC)
                this.logger.warning(`balance before selling: ${balance}`)
                transaction = await this.broker.sellFreedomCash(BigInt(369369369000000000000000000) - balance)
                balance = await this.broker.balanceOf(FC)
                this.logger.warning(`balance after selling:  ${balance}`)
                break
            }
            default: throw new Error(`unknown action: ${action} (typeOfAction ${typeof (action)})`)
        }
        this.logger.info(`waiting for transaction to complete: ${transaction.hash}`)

        await transaction.wait()

    }

    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}
