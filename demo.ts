// I buy and sell https://FreedomCash.org 
import { Investor } from "./src/investor.ts"
// import { Investor } from "https://deno.land/x/freedom_cash_investor/src/investor.ts"
import { Logger } from 'https://deno.land/x/log/mod.ts'

export const logger = await Logger.getInstance() 

logger.debug('example debug message')
logger.info('example info')
logger.warning('example warning')
logger.error('example error message')
logger.critical('example critical message')

const minHistoryLength = 3
const bFactor = 6
const sleepTimeInSeconds = 36
const relevantHistoryLength = 45
const investor: Investor = await Investor.getInstance(relevantHistoryLength, sleepTimeInSeconds, logger)
await investor.startTheParty(minHistoryLength, bFactor)