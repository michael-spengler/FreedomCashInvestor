// I buy and sell https://FreedomCash.org 

import { Broker, MoniqueBaumann, Helper, EMode } from "./mod.ts"

const logger = await Helper.getLogger()
const providerURL = Helper.getProviderURL()
const bHelper = await Helper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)
const moniqueBaumann = new MoniqueBaumann(broker, logger)

const sleepTime = 9
const minHistoryLength = 0
const spreadFactor = 0
const specificAction = undefined
const mode = EMode.actionRandom
await moniqueBaumann.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
