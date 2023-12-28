// I buy and sell https://FreedomCash.org 

import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts"
import { BlockchainHelper } from "./blockchain-helper.ts"

const bHelper: BlockchainHelper = await BlockchainHelper.getInstance()

Deno.test("help with gas calculations", async () => {
    assertEquals(1, 1, "under construction")
})

Deno.test("help with unit calculations", async () => {
    const ethValue = 1
    const weiValue = bHelper.convertToWei(ethValue)
    assertEquals(weiValue, BigInt(1000000000000000000), "check conversion")
})

Deno.test("help with constants", async () => {
    const abi = bHelper.getFreedomCashABI()
    assertEquals(abi.length, 50, "under construction")
})
