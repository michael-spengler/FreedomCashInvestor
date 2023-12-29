import { sleep, Logger } from "../deps.ts"
import { Broker } from "./broker.ts"
import { Helper } from "./helper.ts"
import { Bollinger } from "./bollinger.ts"

export enum EMode {
    actionRandom,
    actionSpecific,
    bollingerReal,
    bollingerDemo
}

export enum EActions {
    voteForGeoCash = "Vote for GeoCash",
    voteForInvestment = "Vote for Investment",
    voteForPublicGood = "Vote for Public Good",
    sendETHWithMessage = "Send Ether with Message",
    swipSwapV3Service = "Utilize the swip swap service",
    takeProfits = "Take Profits",
    executeCommunityInvestment = "Execute Community Investment",
    sellFreedomCash = "Sell Freedom Cash"
}

export class MoniqueBaumann {

    private readonly freedomCashRocks = true
    private partyIsOn = false
    private roundIsActive = false
    private broker: Broker
    private logger: Logger
    private bollinger: Bollinger

    public constructor(broker: Broker, logger: Logger) {
        this.logger = logger
        this.broker = broker
        this.bollinger = new Bollinger(27, logger)
    }

    public async play(sleepTime: number, minHistoryLength: number, spreadFactor: number, action: EActions, mode: EMode) {
        if (this.partyIsOn === true) { throw Error("Already Playing") }
        this.partyIsOn = true
        while (this.freedomCashRocks && !this.roundIsActive) { // protecting against too low sleepTime value
            this.roundIsActive = true
            try {
                await this.playRound(minHistoryLength, spreadFactor, action, mode)
            } catch (error) {
                this.logger.error(error)
            }
            await sleep(sleepTime)
            this.roundIsActive = false
        }
    }
    private async playRound(minHistoryLength: number, spreadFactor: number, action: EActions, mode: EMode): Promise<void> {
        this.logger.info(`playing round with ${minHistoryLength} ${spreadFactor} ${action} ${mode}`)
        if (minHistoryLength > 0 && spreadFactor > 0) {
            if (mode === EMode.bollingerDemo) {
                await this.playBollinger(minHistoryLength, spreadFactor, mode)
            } else if (mode === EMode.bollingerReal) {
                await this.playBollinger(minHistoryLength, spreadFactor, mode)
            }
        } else if (minHistoryLength === 0 && spreadFactor === 0) {
            if (mode === EMode.actionRandom) {
                const index = Math.round((Math.random() * ((6 - 1) - 0) + 0))
                const randomAction = Object.values(EActions)[index]
                this.logger.info(randomAction)
                await this.execute(randomAction)
            } else if (mode === EMode.actionSpecific) {
                await this.execute(action)
            }
        }
        await this.broker.logFundamentals()
    }
    private async playBollinger(minHistoryLength: number, factor: number, mode: EMode) {
        this.logger.info("\n\n*************************** Pulses Of Freedom ***************************")
        await this.broker.logFundamentals()
        let price: number
        if (mode === EMode.bollingerReal) {
            price = await this.broker.getBuyPrice(Helper.convertToWei(1))
        } else {
            price = Math.round((Math.random() * (81 - 9) + 9))
        }
        this.bollinger.addToPriceHistory(price)
        const investmentDecision = this.bollinger.getInvestmentDecision(minHistoryLength, factor)
        if (investmentDecision == "buy") {
            if (mode === EMode.bollingerDemo) {
                this.logger.info("not really buying because we are in demo mode")
            } else if (mode === EMode.bollingerReal) {
                await this.buy()
            }
        } else if (investmentDecision == "sell") {
            await this.sell()
        }
        return
    }
    private async execute(action: EActions): Promise<void> {
        switch (action) {
            case EActions.voteForGeoCash: {
                return this.broker.voteFor("geoCashing", Helper.VITALIK, 999, "geil")
            }
            case EActions.voteForInvestment: {
                return this.broker.voteFor("investmentBet", Helper.UNI, 9999)
            }
            case EActions.voteForPublicGood: {
                return this.broker.voteFor("publicGoodsFunding", Helper.POD, 999)
            }
            case EActions.sendETHWithMessage: {
                return this.broker.sendETHWithMessage(Helper.VITALIK, "Hello Free World", 0.000009)
            }
            case EActions.swipSwapV3Service: {
                return this.broker.swipSwapV3Service(Helper.WETH, Helper.UNI, 0.009, 3000, 30)
            }
            case EActions.takeProfits: {
                return this.broker.takeProfits(Helper.UNI, 1, 3000, 70)
            }
            case EActions.executeCommunityInvestment: {
                return this.broker.executeCommunityInvestment(Helper.UNI, 3000, 30)
            }
            case EActions.sellFreedomCash: {
                return this.broker.sellFreedomCash(999)
            }
            default: throw new Error(`unknown action: ${action} (typeOfAction ${typeof (action)})`)
        }
    }
    // private getRandomAction(): EActions {
    //     const index = Math.round((Math.random() * ((6 - 1) - 0) + 0))
    //     this.logger.info(index)
    //     this.logger.info(EActions[index])
    //     return EActions[index]
    //     // return Object.values(EActions)[index]
    //     // return options[index]
    // }

    protected async buy(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }

    protected async sell(): Promise<void> {
        // see example implementation in https://github.com/monique-baumann/FreedomCash/tree/main/deno/Monique.ts
    }
}