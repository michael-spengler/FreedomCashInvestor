import { Broker } from "./broker.ts";
import { Helper } from "./helper.ts";
import { Logger, ethers } from "../deps.ts";

export class Checker {

    public static instance: Checker

    public static async getInstance(): Promise<Checker> {
        if (this.instance === undefined) {
            const logger = await Helper.getLogger()
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
        await this.checkReasonableAmountOutETHIN()
        await this.checkReasonableAmountOutUNIIN()
    }

    private async checkReasonableAmountOutETHIN() {
        const asset = Helper.UNI
        const poolAddress = await this.broker.getPoolAddress(Helper.WETH, asset, 3000)
        const investmentPriceForAsset = await this.broker.getPriceForInvestment(asset, poolAddress)
        const hypotheticalO = this.calculateAmountOutMinimum(BigInt(10 ** 18), investmentPriceForAsset, BigInt(18))
        const amountOutMinimum = await this.broker.getAmountOutMinimum(Helper.WETH, BigInt(10 ** 18), investmentPriceForAsset, 30)
        if (hypotheticalO < amountOutMinimum) {
            throw new Error(`amountOutMinimum: ${amountOutMinimum} hypotheticalO: ${hypotheticalO}`)
        }
    }
    private calculateAmountOutMinimum(amountIn: bigint, price: bigint, decimals: bigint) {
        try {
            return amountIn * (BigInt(10) ** decimals) / price
        } catch (error) {
            this.logger.warning(error.message)
        }
    }
    private async checkReasonableAmountOutUNIIN() {
        const asset = Helper.WETH
        const poolAddress = await this.broker.getPoolAddress(Helper.UNI, asset, 3000)
        const investmentPriceForAsset = await this.broker.getPriceForInvestment(asset, poolAddress)
        const amountOutMinimum = await this.broker.getAmountOutMinimum(Helper.WETH, BigInt(10 ** 18), investmentPriceForAsset, 30)
        const hypotheticalO = this.calculateAmountOutMinimum(BigInt(10 ** 18), investmentPriceForAsset, BigInt(18))
        if (hypotheticalO < amountOutMinimum) {
            throw new Error(`amountOutMinimum: ${amountOutMinimum} hypotheticalO: ${hypotheticalO}`)
        }
    }
}
