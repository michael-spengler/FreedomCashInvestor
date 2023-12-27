// I buy and sell https://FreedomCash.org 

import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts"
import { DecisionHelper } from "./decision-helper.ts"

const investorServiceBBBased: DecisionHelper = new DecisionHelper(27)
const minHistoryLength = 3

Deno.test("getInvestmentDecision buy", async () => {
    investorServiceBBBased.initializePriceHistory()
    investorServiceBBBased.addToPriceHistory(6)
    investorServiceBBBased.addToPriceHistory(9)
    investorServiceBBBased.addToPriceHistory(3)
    const decision = investorServiceBBBased.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "buy", "check if it is time to buy")
})


Deno.test("getInvestmentDecision hold", async () => {
    investorServiceBBBased.initializePriceHistory()
    investorServiceBBBased.addToPriceHistory(9)
    investorServiceBBBased.addToPriceHistory(3)
    investorServiceBBBased.addToPriceHistory(6)
    const decision = investorServiceBBBased.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "hold", "check if it is time to hold")
})


Deno.test("getInvestmentDecision sell", async () => {
    investorServiceBBBased.initializePriceHistory()
    investorServiceBBBased.addToPriceHistory(6)
    investorServiceBBBased.addToPriceHistory(3)
    investorServiceBBBased.addToPriceHistory(9)
    const decision = investorServiceBBBased.getInvestmentDecision(minHistoryLength)
    assertEquals(decision, "sell", "check if it is time to hold")
})