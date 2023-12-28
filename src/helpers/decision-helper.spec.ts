// I buy and sell https://FreedomCash.org 

import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts"
import { DecisionHelper } from "./decision-helper.ts"

const decisionHelper: DecisionHelper = new DecisionHelper(27)
const minHistoryLength = 3

Deno.test("getInvestmentDecision buy", async () => {
    decisionHelper.initializePriceHistory()
    decisionHelper.addToPriceHistory(6)
    decisionHelper.addToPriceHistory(9)
    decisionHelper.addToPriceHistory(3)
    const decision = decisionHelper.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "buy", "check if it is time to buy")
})


Deno.test("getInvestmentDecision hold", async () => {
    decisionHelper.initializePriceHistory()
    decisionHelper.addToPriceHistory(9)
    decisionHelper.addToPriceHistory(3)
    decisionHelper.addToPriceHistory(6)
    const decision = decisionHelper.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "hold", "check if it is time to hold")
})


Deno.test("getInvestmentDecision sell", async () => {
    decisionHelper.initializePriceHistory()
    decisionHelper.addToPriceHistory(6)
    decisionHelper.addToPriceHistory(3)
    decisionHelper.addToPriceHistory(9)
    const decision = decisionHelper.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "sell", "check if it is time to sell")
})