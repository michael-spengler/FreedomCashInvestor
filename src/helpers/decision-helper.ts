// This code is utilized e.g. to stabilize the buy price and to increase the sell price for Freedom Cash
// https://github.com/monique-baumann/FreedomCash 

import { IBollingerBands, BollingerBandsService } from "https://deno.land/x/bollinger_bands/mod.ts"

export class DecisionHelper {
    private priceHistory: number[]
    private relevantHistoryLength: number
    public constructor(relevantHistoryLength: number) {
        this.priceHistory = []
        this.relevantHistoryLength = relevantHistoryLength
    }
    public addToPriceHistory(price: number): void {
        if (this.priceHistory.length == this.relevantHistoryLength) {
            this.priceHistory.splice(0, 1);
        }
        this.priceHistory.push(price);
        console.log(`priceHistory: ${this.priceHistory}`)
    }
    public initializePriceHistory(): void {
        this.priceHistory = []
    }
    public getBollingerBands(factor: number): IBollingerBands {
        return BollingerBandsService.getBollingerBands(this.priceHistory, factor)
    }
    public getInvestmentDecision(minHistoryLength: number, factor: number = 2): string {
        if(this.priceHistory.length < minHistoryLength) { 
            console.log(`We need to wait ${minHistoryLength - this.priceHistory.length} more intervals before we receive investment decisions.`)
            return "hold" 
        }
        const currentPrice = this.priceHistory[this.priceHistory.length - 1]
        console.log(`price: ${currentPrice}`)
        const wouldBuyAt = this.getBollingerBands(factor).lower[this.priceHistory.length - 1]
        console.log(`wouldBuyAt: ${wouldBuyAt}`)
        const wouldSellAt = this.getBollingerBands(factor).upper[this.priceHistory.length - 1]
        console.log(`wouldSellAt: ${wouldSellAt}`)
        let investmentDecision
        if (currentPrice <= wouldBuyAt) {
            investmentDecision = "buy"
        } else if (currentPrice >= wouldSellAt) {
            investmentDecision = "sell"
        } else {
            investmentDecision = "hold"
        }
        console.log(`ìnvestmentDecision: ${investmentDecision}`)
        return investmentDecision
    }
}