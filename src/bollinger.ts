// This code is utilized e.g. to stabilize the buy price and to increase the sell price for Freedom Cash
// https://github.com/monique-baumann/FreedomCash 

import { Logger, IBollingerBands, BollingerBandsService } from "../deps.ts"

export class Bollinger {
    private priceHistory: number[]
    private relevantHistoryLength: number
    private logger: Logger
    public constructor(relevantHistoryLength: number, logger: Logger) {
        this.priceHistory = []
        this.relevantHistoryLength = relevantHistoryLength
        this.logger = logger
    }
    public addToPriceHistory(price: number): void {
        this.logger.info(`adding ${price} to price history`)
        if (this.priceHistory.length == this.relevantHistoryLength) {
            this.priceHistory.splice(0, 1);
        }
        this.priceHistory.push(price);
        this.logger.info(`priceHistory: ${this.priceHistory}`)
    }
    public initializePriceHistory(): void {
        this.priceHistory = []
    }
    public getBollingerBands(factor: number): IBollingerBands {
        return BollingerBandsService.getBollingerBands(this.priceHistory, factor)
    }
    public getInvestmentDecision(minHistoryLength: number, factor: number = 2): string {
        if(this.priceHistory.length < minHistoryLength) { 
            this.logger.info(`We need to wait ${minHistoryLength - this.priceHistory.length} more intervals before we receive investment decisions.`)
            return "hold" 
        }
        const currentPrice = this.priceHistory[this.priceHistory.length - 1]
        this.logger.info(`price: ${currentPrice}`)
        const wouldBuyAt = this.getBollingerBands(factor).lower[this.priceHistory.length - 1]
        this.logger.info(`wouldBuyAt: ${wouldBuyAt}`)
        const wouldSellAt = this.getBollingerBands(factor).upper[this.priceHistory.length - 1]
        this.logger.info(`wouldSellAt: ${wouldSellAt}`)
        let investmentDecision
        if (currentPrice <= wouldBuyAt) {
            investmentDecision = "buy"
        } else if (currentPrice >= wouldSellAt) {
            investmentDecision = "sell"
        } else {
            investmentDecision = "hold"
        }
        this.logger.info(`ìnvestmentDecision: ${investmentDecision}`)
        return investmentDecision
    }
}