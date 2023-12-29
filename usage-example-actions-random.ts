// I buy and sell https://FreedomCash.org 

import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { Broker, Player, BlockchainHelper, EMode, EActions } from "./mod.ts"

const logger = await BlockchainHelper.getLogger()
const providerURL = BlockchainHelper.getProviderURL()
const bHelper = await BlockchainHelper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)
const player = new Player(broker, logger)

const sleepTime = 9 
const minHistoryLength = 0
const spreadFactor = 0
const specificAction = undefined
const mode = EMode.actionRandom
await player.play(sleepTime, minHistoryLength, spreadFactor, specificAction, mode)
