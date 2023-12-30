// I buy and sell https://FreedomCash.org 

// import { Broker, MoniqueBaumann, Helper, EMode } from "https://deno.land/x/freedom_cash_investor@v/mod.ts"
import { Broker, MoniqueBaumann, Helper, EMode, EDataTypes} from "./mod.ts"

const logger = await Helper.getLogger()
const providerURL = Helper.getProviderURL()
const bHelper = await Helper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)

const interestedIn: EDataTypes[] = []

interestedIn.push(EDataTypes.budgetData)
interestedIn.push(EDataTypes.gamingData)
interestedIn.push(EDataTypes.pricingData)
interestedIn.push(EDataTypes.masterData)
interestedIn.push(EDataTypes.operationalData)

const moniqueBaumann = new MoniqueBaumann(broker, logger, interestedIn)

let sleepTime = 81
let minHistoryLength = 27
let spreadFactor = 3
let specificAction = ""
let mode = EMode.BOLLINGERREAL
await moniqueBaumann.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
