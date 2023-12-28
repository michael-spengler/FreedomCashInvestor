// I buy and sell https://FreedomCash.org 
// import { Investor } from "./src/investor.ts"
import { Investor } from "https://deno.land/x/freedom_cash_investor/mod.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { pkTestWallet, providerURL } from "./.env.ts"

const minLevelForConsole = 'DEBUG' 
const minLevelForFile = 'WARNING' 
const fileName = "./warnings-errors.txt"
const pureInfo = true // leaving out e.g. the time info
export const logger = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)

const minHistoryLength = 3
const bFactor = 6
const sleepTimeInSeconds = 27
const relevantHistoryLength = 45
const investor: Investor = await Investor.getInstance(relevantHistoryLength, sleepTimeInSeconds, logger)
await investor.startTheParty(minHistoryLength, bFactor)