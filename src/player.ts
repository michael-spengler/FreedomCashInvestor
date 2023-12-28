import { Broker } from "./broker.ts"
import { BlockchainHelper } from "./helpers/blockchain-helper.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'

export class Player {
    
    private playingAroundIntervalID: number = 0
    private logger: Logger 

    public constructor(logger: Logger){
        this.logger = logger
    }
    
    public playAround(broker: Broker) {
        if (this.playingAroundIntervalID !== 0) {
            throw new Error("Already Playing")
        }
        this.playingAroundIntervalID = setInterval(async() => {
            const randomOption = this.getRandomOption()
            switch (randomOption) {
    
                case "voteForGeoCash": {
                    return broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
                }
                case "voteForInvestment": {
                    return broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
                }
                case "voteForPublicGood": {
                    return broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
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
                    return broker.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30)
                }
                case "sellFreedomCash": {
                    return broker.sellFreedomCash(999)
                }
                default: throw new Error("unknown option")
            }
    
        }, 18 * 1000)
    }
    public getRandomOption(): string {
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
}