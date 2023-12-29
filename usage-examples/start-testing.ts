// I buy and sell https://FreedomCash.org 
import { Investor } from "../src/investor.ts"
import { BlockchainHelper } from "../src/helpers/blockchain-helper.ts"
// import { Investor } from "https://deno.land/x/freedom_cash_investor/mod.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { Broker } from "../src/broker.ts"
import { Player } from "../src/player.ts"

export const logger = await getLogger()

let providerURL = getProviderURL(logger)

const bHelper = await BlockchainHelper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)

const player = new Player(broker, logger)
player.playAround("swipSwapV3Service")
// player.playAround("sendETHWithMessage")

async function getLogger(): Promise<Logger> {
    const minLevelForConsole = 'DEBUG'
    const minLevelForFile = 'WARNING'
    const fileName = "./warnings-errors.txt"
    const pureInfo = true // leaving out e.g. the time info
    return Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)

}

function getProviderURL(logger: Logger): string | void {
    let configuration: any = {}
    if (Deno.args[0] !== undefined) { // supplying your provider URL via parameter
        return Deno.args[0]
    } else { // ... or via .env.json
        try {
            configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
            return configuration.providerURL
        } catch (error) {
            logger.error(error.message)
            logger.error("without a providerURL I cannot connect to the blockchain")
        }
    }
}