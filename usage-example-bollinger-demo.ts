// I buy and sell https://FreedomCash.org 

import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { Broker, Player, BlockchainHelper, EMode } from "./mod.ts"

const logger = await BlockchainHelper.getLogger()
const providerURL = BlockchainHelper.getProviderURL()
const bHelper = await BlockchainHelper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)
const player = new Player(broker, logger)

let sleepTime = 9 
let minHistoryLength = 3
let spreadFactor = 3
let specificAction = ""
let mode = EMode.BOLLINGERDEMO
await player.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
