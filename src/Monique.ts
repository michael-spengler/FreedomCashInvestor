import { Investor } from "./investor.ts";
import { FundamentalsProvider } from "./fundamentals-provider.ts"
import { BlockchainHelper } from "./helpers/blockchain-helper.ts"
import { DecisionHelper } from "./helpers/decision-helper.ts"
import { Broker } from "./broker.ts";
import { TestPlayer } from "./helpers/test-player";
import { Logger } from 'https://deno.land/x/log/mod.ts'


export class Monique extends Investor {

    public static instance: Monique

    public static async getInstance(historyLength: number, sleepTime: number, logger: Logger): Promise<Investor> {
        if (Investor.instance == undefined) {
            const bHelper = await BlockchainHelper.getInstance()
            const broker = new Broker(bHelper)
            const dHelper = new DecisionHelper(historyLength)
            Investor.instance = new Monique(sleepTime, bHelper, dHelper, broker, logger)
        }
        return Investor.instance
    }

    private broker: Broker
    private player: TestPlayer
    private logger: Logger 

    private constructor(sleepTime: number, bHelper: BlockchainHelper, dHelper: DecisionHelper, broker: Broker, logger: Logger) {
        super(sleepTime, bHelper, dHelper, broker)
        this.broker = broker
        this.logger = logger
    }

    protected async getBuyPrice(amountToBeBought: number): Promise<number> {
        return this.broker.getBuyPrice(amountToBeBought)

    }

    protected async buy(): Promise<void> {
        await this.broker.voteForInvestment(9)
    }

    protected async sell(): Promise<void> {
        await this.broker.sell(9)        
        // see real life implementation example in 
        // https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    public letTheMusicPlay() {
        // https://www.youtube.com/watch?v=3UCXiiS9Nfc
        this.player.playAround()
    }
    
}

const monique = await Monique.getInstance(36, 27)
console.log(await monique.getBuyPrice(999))
// const minHistoryLength = 3
// const bFactor = 6
// await monique.startTheParty(minHistoryLength, bFactor)
monique.letTheMusicPlay()