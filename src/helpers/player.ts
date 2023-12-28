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


const bHelper = await BlockchainHelper.getInstance()
const broker = new Broker(bHelper)
const buyPrice = await broker.getBuyPrice(9)
console.log(buyPrice)
await broker.getInvestmentBudget()
// await broker.sendETHWithMessage("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2", "super", 9)
await broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
// await broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
// await broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
//await broker.sellFreedomCash(999)

// await broker.takeProfits(BlockchainHelper.UNI, 31, 3000, 0)

// await broker.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, 31, 3000, 30)
// await broker.getAmountOutMinimum(BlockchainHelper.UNI, BlockchainHelper.WETH, 31, 3000, 30)
// let transaction = await contractWithTestWalletAsSigner.voteForInvestmentIn(UNI, bPrice, aToBeBoughtInWei, { value: bcost })
// await tx.wait()