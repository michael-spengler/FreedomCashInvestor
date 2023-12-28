// I buy and sell https://FreedomCash.org 

import { sleep } from "https://deno.land/x/sleep/mod.ts"
import { BlockchainHelper } from "./helpers/blockchain-helper.ts"
import { DecisionHelper } from "./helpers/decision-helper.ts"
import { Broker } from "./broker.ts"

export class Investor {

    public static instance: Investor

    public static async getInstance(historyLength: number, sleepTime: number): Promise<Investor> {
        if (Investor.instance == undefined) {
            const blockchainHelper = await BlockchainHelper.getInstance()
            const broker = new Broker(blockchainHelper)
            const decisionHelper = new DecisionHelper(historyLength)
            Investor.instance = new Investor(sleepTime, blockchainHelper, decisionHelper, broker)
        }
        return Investor.instance
    }

    private readonly freedomCashRocks = true
    private sleepTime
    private partyIsOn = false
    private roundIsActive = false
    private decisionHelper: DecisionHelper
    private broker: Broker

    private constructor(sleepTime: number, bHelper: BlockchainHelper, dHelper: DecisionHelper, broker: Broker) {
        this.sleepTime = sleepTime
        this.decisionHelper = dHelper
        this.broker = broker
    }

    public async startTheParty(minHistoryLength: number, factor: number = 2): Promise<void> {
        if (this.partyIsOn === true) { throw Error("The Party Has Already Been Started") }
        this.partyIsOn = true
        console.log(`\n\nsleepTime: ${this.sleepTime} \nminHistoryLength: ${minHistoryLength}`)
        while (this.freedomCashRocks && !this.roundIsActive) { // protecting against too low sleepTime value
            this.roundIsActive = true
            console.log("\n\n*************************** Pulses Of Freedom ***************************")
            await this.broker.logFundamentals()
            const price = await this.getBuyPrice()
            this.decisionHelper.addToPriceHistory(price)
            const investmentDecision = this.decisionHelper.getInvestmentDecision(minHistoryLength, factor)
            if (investmentDecision == "buy") {
                await this.buy()
            } else if (investmentDecision == "sell") {
                await this.sell()
            }
            await sleep(this.sleepTime) // time to sleep in peace and harmony
            this.roundIsActive = false
        }
    }

    protected async getBuyPrice(): Promise<number> {
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