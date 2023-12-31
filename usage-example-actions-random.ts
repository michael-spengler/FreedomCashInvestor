// I buy and sell https://FreedomCash.org 

// import { Broker, MoniqueBaumann, Helper, EMode, EActions } from "https://deno.land/x/freedom_cash_investor@v/mod.ts"
import { MoniqueBaumann, EMode, EDataTypes } from "./mod.ts"

const interestedIn: EDataTypes[] = []

interestedIn.push(EDataTypes.budgetData)
interestedIn.push(EDataTypes.gamingData)
interestedIn.push(EDataTypes.pricingData)
// interestedIn.push(EDataTypes.masterData) // not too interesting in Monique's day to day life
// interestedIn.push(EDataTypes.operationalData) // not too interesting in Monique's day to day life

const moniqueBaumann = await MoniqueBaumann.getInstance(interestedIn)

const sleepTime = 27
const minHistoryLength = 0
const spreadFactor = 0
const specificAction = undefined
const mode = EMode.actionRandom
await moniqueBaumann.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
