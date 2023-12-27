import { Broker } from "../broker.ts"

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
                    console.log("voting for GeoCash")
                    return
                }
                case "voteForInvestment": {
                    console.log("voting for Investment")
                    await broker.voteForInvestment(9)
                    return
                }
                case "voteForPublicGood": {
                    console.log("voting for Public Good")
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
                    console.log("executing community investment")
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