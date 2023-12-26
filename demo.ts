// I buy and sell https://FreedomCash.org 
import { Investor } from "https://deno.land/x/freedom_cash_investor/src/investor.ts"

const minHistoryLength = 3
const bFactor = 6
const sleepTimeInSeconds = 9
const relevantHistoryLength = 27
const investor: Investor = new Investor(relevantHistoryLength, sleepTimeInSeconds)
await investor.startTheParty(minHistoryLength, bFactor)