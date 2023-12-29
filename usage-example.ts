// I buy and sell https://FreedomCash.org 

import {  } from "./src/blockchain-helper.ts"
// import { Investor } from "https://deno.land/x/freedom_cash_investor/mod.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { Broker,Player, BlockchainHelper,  EMode } from "./mod.ts"

export const logger = await BlockchainHelper.getLogger()

let providerURL = await BlockchainHelper.getProviderURL()

const bHelper = await BlockchainHelper.getInstance(providerURL)
const broker = new Broker(bHelper, logger)
const player = new Player(broker, logger, EMode.BOLLINGERDEMO)
// await player.play("voteForInvestment")
await player.play(3)

// player.play("takeProfits")
// player.play("swipSwapV3Service")
// player.play("sendETHWithMessage")
