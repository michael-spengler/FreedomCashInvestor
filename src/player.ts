import { Broker } from "./broker.ts"
import { BlockchainHelper } from "./helpers/blockchain-helper.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'

export class Player {

    private readonly roundLength = 27
    private playingAroundIntervalID: number = 0
    private broker: Broker
    private logger: Logger

    public constructor(broker: Broker, logger: Logger) {
        this.logger = logger
        this.broker = broker
    }
    public playAround() {
        if (this.playingAroundIntervalID !== 0) {
            this.logger.error("Already Playing")
        } else {
            this.playingAroundIntervalID = setInterval(async () => {
                try {
                    await this.execute(this.getRandomOption())
                } catch (error) {
                    this.logger.error(error.message)
                }
            }, this.roundLength * 1000)
        }
    }
    private getRandomOption(): string {
        const options = [
            "voteForGeoCash",
            "voteForInvestment",
            "voteForPublicGood",
            "sendETHWithMessage",
            "swipSwapV3Service",
            "takeProfits",
            "executeCommunityInvestment",
            "sellFreedomCash"
        ]
        const index = Math.round((Math.random() * ((options.length - 1) - 0) + 0))
        return options[index]
    }
    private async execute(action: string) {
        switch (action) {
            case "voteForGeoCash": {
                return this.broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
            }
            case "voteForInvestment": {
                return this.broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
            }
            case "voteForPublicGood": {
                return this.broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
            }
            case "sendETHWithMessage": {
                console.log("sending ETH with Message")
                return
            }
            case "swipSwapV3Service": {
                console.log("using the SwipSwapV3Service")
                return
            }
            case "takeProfits": {
                console.log("taking profits")
                return
            }
            case "executeCommunityInvestment": {
                return this.broker.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30)
            }
            case "sellFreedomCash": {
                return this.broker.sellFreedomCash(999)
            }
            default: throw new Error("unknown option")
        }
    }
}