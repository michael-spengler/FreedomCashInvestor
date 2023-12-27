// I buy and sell https://FreedomCash.org 

import { sleep } from "https://deno.land/x/sleep/mod.ts"
import { FundamentalsProvider } from "./fundamentals-provider.ts"
import { BlockchainHelper } from "./helpers/blockchain-helper.ts"
import { DecisionHelper } from "./helpers/decision-helper.ts"

export class Investor {

    public static instance: Investor

    public static async getInstance(relevantHistoryLength: number, sleepTimeInSeconds: number): Promise<Investor> {
        if (Investor.instance == undefined) {
            const helper = await BlockchainHelper.getInstance()
            const fundamentalsProvider = new FundamentalsProvider(helper)
            Investor.instance = new Investor(relevantHistoryLength, sleepTimeInSeconds, fundamentalsProvider)
        }
        return Investor.instance
    }

    private readonly freedomCashRocks = true
    private sleepTimeInSeconds
    private partyIsOn = false
    private roundIsActive = false
    private investorServiceBBBased: DecisionHelper
    private fundamentalsProvider: FundamentalsProvider

    private constructor(relevantHistoryLength: number, sleepTimeInSeconds: number, fundamentalsProvider: FundamentalsProvider) {
        this.sleepTimeInSeconds = sleepTimeInSeconds
        this.investorServiceBBBased = new DecisionHelper(relevantHistoryLength)
        this.fundamentalsProvider = fundamentalsProvider
    }

    public async startTheParty(minHistoryLength: number, factor: number = 2): Promise<void> {
        if (this.partyIsOn === true) { throw Error("The Party Has Already Been Started")}
        this.partyIsOn = true
        console.log(`\n\nsleepTimeInSeconds: ${this.sleepTimeInSeconds} \nminHistoryLength: ${minHistoryLength}`)
        while (this.freedomCashRocks && !this.roundIsActive){ // protecting against too low sleepTimeInSeconds value
            this.roundIsActive = true
            console.log("\n\n*************************** Pulses Of Freedom ***************************")    
            await this.fundamentalsProvider.readAndLogPricingData()
            await this.fundamentalsProvider.readAndLogMasterData()
            await this.fundamentalsProvider.readAndLogBudgetData()
            await this.fundamentalsProvider.readAndLogGamingData()
            await this.fundamentalsProvider.readAndLogOperationalData()    
        
            const price = await this.getCurrentPrice()
            this.investorServiceBBBased.addToPriceHistory(price)
            const investmentDecision = this.investorServiceBBBased.getInvestmentDecision(minHistoryLength, factor)
            if (investmentDecision == "buy") {
                await this.buy()
            } else if (investmentDecision == "sell") {
                await this.sell()
            }
            await sleep(this.sleepTimeInSeconds) // time to sleep in peace and harmony
            this.roundIsActive = false
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