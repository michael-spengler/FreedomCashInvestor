import { Broker } from "./broker.ts";
import { Helper } from "./helper.ts";
import { Logger, ethers } from "../deps.ts";

export class Checker {

    public static instance: Checker

    public static async getInstance(): Promise<Checker> {
        if (this.instance === undefined) {
            const logger = await Logger.getInstance()
            const helper = await Helper.getInstance(Helper.getProviderURL(logger))
            const broker = await Broker.getInstance()
            Checker.instance = new Checker(broker, helper, logger)
        }
        return Checker.instance

    }
    
    private broker: Broker
    private logger: Logger
    private helper: Helper

    private constructor(broker: Broker, helper: Helper, logger: Logger) {
        this.broker = broker
        this.helper = helper
        this.logger = logger
    }

    public async checkConsistency(): Promise<void> {
        await this.checkReasonableAmountOut()
    }

    private async checkReasonableAmountOut() {
        const asset = Helper.UNI
        const poolAddress = await this.broker.getPoolAddress(Helper.WETH, asset, 3000)
        this.logger.debug(`poolAddress: ${poolAddress}`)
        const investmentPriceForAsset = await this.broker.getInvestmentPriceForAsset(asset, poolAddress)
        this.logger.debug(`investment price for ${asset}: ${ethers.formatEther(investmentPriceForAsset)}`)
        const amountOutMinimum = await this.broker.getAmountOutMinimum(Helper.WETH, asset, Helper.convertToWei(1), 3000, 30)
        this.logger.debug(`amountOutMinimum: ${ethers.formatEther(amountOutMinimum)}`)
    }
}
