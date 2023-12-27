// I buy and sell https://FreedomCash.org 

import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts"
import { Helper } from "./helper.ts"

const helper = new Helper()

Deno.test("help with gas calculations", async () => {
    assertEquals(1, 1, "under construction")
})

Deno.test("help with unit calculations", async () => {
    assertEquals(1, 1, "under construction")
})

Deno.test("help with constants", async () => {
    const abi = helper.getFreedomCashABI()
    console.log(abi)
    assertEquals(1, 1, "under construction")
})
