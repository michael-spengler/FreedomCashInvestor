// I buy and sell https://FreedomCash.org 
// import { Investor } from "./src/investor.ts"
import { Investor } from "https://deno.land/x/freedom_cash_investor/mod.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'


export const logger = getLogger()

let providerURL = getProviderURL()

const minHistoryLength = 3
const bFactor = 6
const sleepTimeInSeconds = 27
const relevantHistoryLength = 45
const investor: Investor = await Investor.getInstance(relevantHistoryLength, sleepTimeInSeconds, logger)
await investor.startTheParty(minHistoryLength, bFactor)


// const bHelper = await BlockchainHelper.getInstance(providerURL)
// const broker = new Broker(bHelper, logger)
// const buyPrice = await broker.getBuyPrice(9)
// console.log(buyPrice)
// await broker.getInvestmentBudget()
// await broker.sendETHWithMessage("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2", "super", 9)
// await broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
// await broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
// await broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
//await broker.sellFreedomCash(999)

// await broker.takeProfits(BlockchainHelper.UNI, 31, 3000, 0)

// await broker.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, 31, 3000, 30)
// await broker.getAmountOutMinimum(BlockchainHelper.UNI, BlockchainHelper.WETH, 31, 3000, 30)
// let transaction = await contractWithTestWalletAsSigner.voteForInvestmentIn(UNI, bPrice, aToBeBoughtInWei, { value: bcost })
// await tx.wait()

// this.testWallet = new ethers.Wallet(pkTestWallet, this.provider);

function getLogger(): Logger {
    const minLevelForConsole = 'DEBUG'
    const minLevelForFile = 'WARNING'
    const fileName = "./warnings-errors.txt"
    const pureInfo = true // leaving out e.g. the time info
    return Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
}

function getProviderURL(): string {
    if (Deno.args[0] !== undefined) { // supplying your provider URL via parameter
        providerURL = Deno.args[0]
    } else { // ... or via .env.json
        try {
            configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
            providerURL = configuration.providerURL
        } catch (error) {
            logger.error(error.message)
            logger.error("without a providerURL I cannot connect to the blockchain")
        }
    }
    return providerURL
}