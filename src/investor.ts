// I buy and sell https://FreedomCash.org 

import { sleep } from "https://deno.land/x/sleep/mod.ts"
import { InvestorServiceBBBased } from "./investor-service.ts"

export class Investor {

    private readonly freedomCashRocks = true
    private sleepTimeInSeconds
    private investorServiceBBBased: InvestorServiceBBBased
    
    public constructor(relevantHistoryLength: number, sleepTimeInSeconds: number = 9) {
        this.sleepTimeInSeconds = sleepTimeInSeconds
        this.investorServiceBBBased = new InvestorServiceBBBased(relevantHistoryLength)
    }

    public async startTheParty(minHistoryLength: number, factor: number = 2): Promise<void> {
        console.log(`\n\nsleepTimeInSeconds: ${this.sleepTimeInSeconds} \nminHistoryLength: ${minHistoryLength}`)
        while (this.freedomCashRocks){
            console.log("\n\n*************************** Pulses Of Freedom ***************************")    
            const price = await this.getCurrentPrice()
            this.investorServiceBBBased.addToPriceHistory(price)
            const investmentDecision = this.investorServiceBBBased.getInvestmentDecision(minHistoryLength, factor)
            if (investmentDecision == "buy") {
                await this.buy()
            } else if (investmentDecision == "sell") {
                await this.sell()
            }
            await sleep(this.sleepTimeInSeconds)
        }    
    }

    protected async getCurrentPrice(): Promise<number> {
        return Math.round((Math.random() * (81 - 9) + 9)) 
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}