import { Broker } from "../broker.ts"
import { BlockchainHelper } from "./blockchain-helper.ts"

export class Player {
    
    private playingAroundIntervalID

    public playAround(broker: Broker) {
        if (this.playingAroundIntervalID !== undefined) {
            throw new Error("Already Playing")
        }
        this.playingAroundIntervalID = setInterval(async() => {
            const randomOption = this.getRandomOption()
            switch (randomOption) {
    
                case "voteForGeoCash": {
                    await broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
                    return
                }
                case "voteForInvestment": {
                    await broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
                    return
                }
                case "voteForPublicGood": {
                    await broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
                    return
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
                    await broker.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30)


                    return
                }
                case "sellFreedomCash": {
                    console.log("sell Freedom Cash")
                    return
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