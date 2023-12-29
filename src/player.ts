import { sleep } from "https://deno.land/x/sleep@v1.3.0/mod.ts"
import { Broker } from "./broker.ts"
import { BlockchainHelper } from "./blockchain-helper.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'
import { Bollinger } from "./bollinger.ts"

export enum EMode {
    RANDOM,
    BOLLINGERREAL,
    BOLLINGERDEMO
}
export class Player {

    private readonly freedomCashRocks = true
    private partyIsOn = false
    private roundIsActive = false
    private broker: Broker
    private logger: Logger
    private mode: EMode
    private bollinger: Bollinger

    public constructor(broker: Broker, logger: Logger, mode: EMode) {
        this.logger = logger
        this.broker = broker
        this.mode = mode
        this.bollinger = new Bollinger(27, logger)
    }
    private async playBollinger(minHistoryLength: number, factor: number) {
        this.logger.info("\n\n*************************** Pulses Of Freedom ***************************")
        await this.broker.logFundamentals()
        let price = 9000000 
        if (this.mode === EMode.BOLLINGERREAL) {
            price = await this.broker.getBuyPrice(BlockchainHelper.convertToWei(1))
        } else {
            price = Math.round((Math.random() * (81 - 9) + 9))
        }
        this.bollinger.addToPriceHistory(price)
        const investmentDecision = this.bollinger.getInvestmentDecision(minHistoryLength, factor)
        if (investmentDecision == "buy") {
            if (this.mode === EMode.BOLLINGERDEMO){
                this.logger.info("not really buying because we are in demo mode")
            } else if (this.mode === EMode.BOLLINGERREAL) {
                await this.buy()
            }
        } else if (investmentDecision == "sell") {
            await this.sell()
        }        
        return 
    }
    public async play(sleepTime: number, action?: string) {
        if (this.partyIsOn === true) { throw Error("Already Playing") }
        this.partyIsOn = true
        while (this.freedomCashRocks && !this.roundIsActive) { // protecting against too low sleepTime value
            this.roundIsActive = true
            try {
                if (action !== undefined) {
                    await this.execute(action)
                } else if (this.mode === EMode.RANDOM) {
                    await this.execute(this.getRandomOption())
                } else if (this.mode === EMode.BOLLINGERDEMO) {
                    await this.playBollinger(3, 3)
                } else if (this.mode === EMode.BOLLINGERREAL) {
                    await this.playBollinger(27, 3)
                    
                }
                await this.broker.logFundamentals()
            } catch (error) {
                this.logger.error(error.message)
                this.logger.error(error)
            }
            await sleep(sleepTime)
            this.roundIsActive = false
        }
    }
    private async execute(action: string) {
        switch (action) {
            case "voteForGeoCash": {
                return this.broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
            }
            case "voteForInvestment": {
                return this.broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
            }
            case "voteForPublicGood": {
                return this.broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
            }
            case "sendETHWithMessage": {
                return this.broker.sendETHWithMessage(BlockchainHelper.VITALIK, "Hello Free World", 0.000009)
            }
            case "swipSwapV3Service": {
                return this.broker.swipSwapV3Service(BlockchainHelper.WETH, BlockchainHelper.UNI, 0.009, 3000, 30)
            }
            case "takeProfits": {
                return this.broker.takeProfits(BlockchainHelper.UNI, 1, 3000, 70)
            }
            case "executeCommunityInvestment": {
                return this.broker.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30)
            }
            case "sellFreedomCash": {
                return this.broker.sellFreedomCash(999)
            }
            default: throw new Error("unknown option")
        }
    }
    private getRandomOption(): string {
        const options = [
            "voteForGeoCash",
            "voteForInvestment",
            "voteForPublicGood",
            "sendETHWithMessage",
            "swipSwapV3Service",
            "takeProfits",
            "executeCommunityInvestment",
            "sellFreedomCash"
        ]
        const index = Math.round((Math.random() * ((options.length - 1) - 0) + 0))
        return options[index]
    }
    
    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}