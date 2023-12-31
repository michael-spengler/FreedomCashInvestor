// I buy and sell https://FreedomCash.org 

// import { Broker, MoniqueBaumann, Helper, EMode, EActions } from "https://deno.land/x/freedom_cash_investor@v/mod.ts"
import { EDataTypes, Broker, MoniqueBaumann, Helper, EMode, EActions } from "./mod.ts"

const interestedIn: EDataTypes[] = []

interestedIn.push(EDataTypes.budgetData)
interestedIn.push(EDataTypes.gamingData)
// interestedIn.push(EDataTypes.pricingData)
// interestedIn.push(EDataTypes.masterData)
// interestedIn.push(EDataTypes.operationalData)

const moniqueBaumann = await MoniqueBaumann.getInstance(interestedIn)

const sleepTime = 9
const minHistoryLength = 0
const spreadFactor = 0
const specificAction = EActions.executeCommunityInvestment
const mode = EMode.actionSpecific
await moniqueBaumann.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
