// I buy and sell https://FreedomCash.org 

// import { Broker, MoniqueBaumann, Helper, EMode, EActions } from "https://deno.land/x/freedom_cash_investor@v/mod.ts"
import { MoniqueBohr,} from "./mod.ts"
import { EDataTypes, EActions} from "./src/constants-types-infrastructure.ts"


const interestedIn: EDataTypes[] = []

interestedIn.push(EDataTypes.budgetData)
interestedIn.push(EDataTypes.gamingData)
interestedIn.push(EDataTypes.pricingData)
interestedIn.push(EDataTypes.attestations)

const moniqueBohr = await MoniqueBohr.getInstance(interestedIn)

await moniqueBohr.play(EActions.voteForInvestment)
