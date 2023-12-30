import { ethers, Logger } from '../deps.ts';
import { Helper } from './helper.ts';
import { EDataTypes } from './monique-baumann.ts';

export class Broker {

    private bcHelper: Helper
    private provider: any
    private contract: any
    private logger: Logger

    public constructor(bcHelper: Helper, logger: Logger) {
        this.bcHelper = bcHelper
        this.provider = this.bcHelper.getProvider()
        this.contract = this.bcHelper.getContract()
        this.logger = logger
    }

    public async voteFor(voteType: string, asset: string, amountToBeBought: number, text?: string): Promise<void> {
        this.logger.info(`\nvoting for ${voteType} for asset ${asset} with amountToBeBought ${amountToBeBought}`)
        let balance = await this.contract.balanceOf(Helper.FC)
        this.logger.debug(`sc balance before: ${balance}`)
        const amountInWei = Helper.convertToWei(amountToBeBought)
        const bPrice = await this.contract.getBuyPrice(amountInWei);
        const bcost = BigInt(amountToBeBought) * bPrice;
        let transaction
        if (voteType == "investmentBet") {
            transaction = await this.contract.voteForInvestmentIn(asset, bPrice, amountInWei, { value: bcost })
        } else if (voteType == "publicGoodsFunding") {
            transaction = await this.contract.voteForPublicGood(asset, bPrice, amountInWei, { value: bcost })
        } else if (voteType == "geoCashing") {
            transaction = await this.contract.voteForGeoCash(asset, text, bPrice, amountInWei, { value: bcost })
        }
        await transaction.wait()
        balance = await this.contract.balanceOf(Helper.FC)
        this.logger.debug(`sc balance after : ${balance}`)
    }

    public async sellFreedomCash(amount: number): Promise<void> {
        this.logger.info("\nselling Freedom Cash")
        let balance = await this.contract.balanceOf(Helper.FC)
        this.logger.debug(`sc balance before: ${balance}`)
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash((Helper.convertToWei(amount)), sellPrice)
        balance = await this.contract.balanceOf(Helper.FC)
        this.logger.info(`sc balance after : ${balance}`)
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        this.logger.info("\nexecuting community investment")
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            let result = await this.contract.executeCommunityInvestment(Helper.UNI, poolFee, maxSlip);
            this.logger.debug(`result: ${result}`);
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    public async takingProfitsMakesSense(asset: string, amount): Promise<boolean> {
        const buyPrice = await this.contract.getBuyPrice(Helper.convertToWei(1))
        const sellPrice = await this.contract.getSellPrice()
        if ((sellPrice + (sellPrice * (BigInt(9) / BigInt(100)))) <= buyPrice) {
            const assetContract = await this.bcHelper.getAssetContract(asset)
            const balance = await assetContract.balanceOf(Helper.FC)
            if (balance >= Helper.convertToWei(amount)) {
                this.logger.debug(`balance of ${asset} in our contract: ${balance}`)
                return true;
            } else {
                this.logger.warning(`balance of ${asset} in our contract: ${balance} too low to sell ${amount}`)
                return false;
            }
        } else {
            this.logger.warning(`we would only sell ${asset} if (buyPrice > sellPrice * 1.09)`)
        }
        return false;
    }
    public async takeProfits(asset: string, amount: number, poolFee: number, maxSlip: number): Promise<void> {
        if (await this.takingProfitsMakesSense(asset, amount)) {

            const amountInWei = Helper.convertToWei(amount)
            const amountOutMinimum = await this.contract.getAmountOutMinimum(asset, Helper.WETH, amountInWei, poolFee, maxSlip)
            this.logger.info(`\ntaking profits by selling ${amount} ${asset} (${amountInWei}) to receive at least: ${amountOutMinimum} ${Helper.WETH}`)
            try {
                await this.contract.takeProfits(asset, amountInWei, poolFee, maxSlip);
            } catch (error) {
                alert(error.message);
            }
        } else {
            this.logger.warning(`It seems unreasonable to sell ${amount} ${asset} atm.`)
        }
    }
    public async getAmountOutMinimum(assetIn: string, assetOut: string, amountIn: number, poolFee: number, maxSlip: number): Promise<number> {
        const amountOutMin =
            await this.contract.getAmountOutMinimum(assetIn, assetOut, amountIn, poolFee, maxSlip)
        this.logger.debug(`amountOutMin: ${amountOutMin}`)
        return amountOutMin
    }
    public async swipSwapV3Service(tIn: string, tOut: string, amount: number, poolFee: number, maxSlip: number): Promise<void> {
        const amountInWei = Helper.convertToWei(amount)
        const amountOutMinimum =
            await this.contract.getAmountOutMinimum(Helper.WETH, Helper.UNI, amountInWei, poolFee, maxSlip)
        this.logger.info(`\nusing the SwipSwapV3Service to swap ${amount} ${tIn} to ${tOut} with minimum output ${amountOutMinimum}, poolFee: ${poolFee}, maxSlip: ${maxSlip}`)
        try {
            let result = await this.contract.swipSwapV3Service(tIn, tOut, poolFee, amountOutMinimum, { value: amountInWei });
        } catch (error) {
            this.logger.error(error.message);
        }

        // const gasPrice = (await this.provider.getGasPrice()) * 9;

    }
    public async sendETHWithMessage(target: string, message: string, amount: number): Promise<void> {
        const encodedMessage = ethers.encodeBytes32String(message)
        const amountInWei = Helper.convertToWei(amount)
        this.logger.info(`\nsending ${amount} ETH (${amountInWei} WEI) with Message: ${message}`)
        let balance = await this.provider.getBalance(Helper.FC)
        this.logger.debug(`sc balance before: ${balance}`)
        const tx = await this.contract.sendETHWithMessage(target, encodedMessage, { value: BigInt(amountInWei) })
        await tx.wait()
        balance = await this.provider.getBalance(Helper.FC)
        this.logger.debug(`sc balance after: ${balance}`)
    }
    public async getBuyPrice(amountToBeBought: number): Promise<BigInt> {
        const aToBeBought = BigInt(amountToBeBought);
        let aToBeBoughtInWei = BigInt(ethers.parseEther(aToBeBought.toString()));

        return BigInt(await this.contract.getBuyPrice(aToBeBoughtInWei));
    }
    public async getInvestmentBudget(): Promise<number> {
        const investmentBudget =
            ethers.formatEther((await this.contract.investmentBudget()).toString())
        this.logger.debug(`investmentBudget: ${investmentBudget}`)
        return investmentBudget
    }
    public async factoryAddress(): Promise<any> {
        return this.contract.factoryAddress()
    }
    public async decimals(): Promise<any> {
        return this.contract.decimals()
    }
    public async routerAddress(): Promise<any> {
        return this.contract.routerAddress()
    }
    public async symbol(): Promise<any> {
        return this.contract.symbol()
    }
    public async totalSupply(): Promise<any> {
        return this.contract.totalSupply()
    }
    public async wethAddress(): Promise<any> {
        return this.contract.wethAddress()
    }
    public async amountOfETHInSmartContract(): Promise<any> {
        // return ethers.formatEther(this.provider.getBalance(Helper.FC).toString())
        return this.provider.getBalance(Helper.FC)
    }
    public async balanceOf(): Promise<any> {
        return this.contract.balanceOf(Helper.FC)
    }
    public async geoCashingBudget(): Promise<any> {
        return this.contract.geoCashingBudget()
    }
    public async publicGoodsFundingBudget(): Promise<any> {
        return this.contract.publicGoodsFundingBudget()
    }
    public async investmentBudget(): Promise<any> {
        return this.contract.investmentBudget()
    }
    public async addressOfHighestSoFarInvestment(): Promise<any> {
        return this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("investmentBet"))
    }
    public async addressOfHighestSoFarPublicGood(): Promise<any> {
        return this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("publicGoodsFunding"))
    }
    public async addressOfHighestSoFarGeoCash(): Promise<any> {
        return this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("geoCashing"))
    }
    public async poolAddress(tIn: string, tOut: string, poolFee: number): Promise<any> {
        return this.contract.getPoolAddress(tIn, tOut, poolFee)
    }
    public async investmentPriceForAsset(asset: string, poolAddress: string): Promise<any> {
        return this.contract.getInvestmentPriceForAsset(asset, poolAddress)
    }
    public async amountOutMinimum(tIn: string, tOut: string, amount: BigInt, poolFee: number, maxSlip: number): Promise<any> {
        return this.contract.getAmountOutMinimum(Helper.WETH, Helper.UNI, amount, poolFee, maxSlip)
    }
    public async gCCCounter(): Promise<any> {
        return this.contract.gCCCounter()
    }
    public async pGCCounter(): Promise<any> {
        return this.contract.iCCounter()
    }
    public async iCCounter(): Promise<any> {
        return this.contract.iCCounter()
    }
    public async geoCashingCandidatesAt(index: number): Promise<any> {
        return this.contract.geocashingCandidates(index)
    }
    public async investmentCandidatesAt(index: number): Promise<any> {
        return this.contract.investmentCandidates(index)
    }
    public async publicGoodCandidatesAt(index: number): Promise<any> {
        return this.contract.publicGoodCandidates(index)
    }
    public async iCIDAt(address: string): Promise<any> {
        return this.contract.iCIDs(address)
    }
    public async pGCIDAt(address: string): Promise<any> {
        return this.contract.pGCIDs(address)
    }
    public async gCCIDAt(address: string): Promise<any> {
        return this.contract.gCCIDs(address)
    }
    public async allowance(owner: string, spender: string): Promise<any> {
        return this.contract.allowance(owner, spender)
    }
    public async buyPrice(amountToBeBought: number): Promise<any> {
        return this.contract.getBuyPrice(Helper.convertToWei(amountToBeBought))
    }
    public async sellPrice(): Promise<any> {
        return this.contract.getSellPrice()
    }
    public async getPoolAddress(tIn: string, tOut: string, poolFee: number): Promise<any> {
        return this.contract.getPoolAddress(tIn, tOut, poolFee)
    }

    public async logFundamentals(clientInterestedIn: EDataTypes[]): Promise<void> {

        if (clientInterestedIn.indexOf(EDataTypes.masterData) > -1) {
            this.logger.info("\n\n*************************** Master Data ***************************")
            this.logger.debug(`smartContractAddress: ${Helper.FC}`)
            this.logger.debug(`totalSupply: ${await this.totalSupply()}`)
            this.logger.debug(`symbol: ${await this.symbol()}`)
            this.logger.debug(`decimals: ${await this.decimals()}`)
            this.logger.debug(`routerAddress: ${await this.routerAddress()}`)
            this.logger.debug(`factoryAddress: ${await this.factoryAddress()}`)
            this.logger.debug(`wethAddress: ${await this.wethAddress()}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.budgetData) > -1) {
            this.logger.info("\n\n*************************** Budget Data ***************************")
            this.logger.debug(`amountOfETHInSmartContract: ${await this.amountOfETHInSmartContract()}`)
            this.logger.debug(`balanceOf Smart Contract: ${await this.balanceOf()}`)
            this.logger.debug(`investmentBudget: ${await this.investmentBudget()}`)
            this.logger.debug(`publicGoodsFundingBudget: ${await this.publicGoodsFundingBudget()}`)
            this.logger.debug(`geoCashingBudget: ${await this.geoCashingBudget()}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.gamingData) > -1) {
            this.logger.info("\n\n*************************** Gaming Data ***************************")
            this.logger.debug(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
            this.logger.debug(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
            this.logger.debug(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)
            this.logger.debug(`investmentCandidatesAt0: ${await this.investmentCandidatesAt(0)}`)
            this.logger.debug(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
            this.logger.debug(`publicGoodCandidatesAt0: ${await this.publicGoodCandidatesAt(0)}`)
            this.logger.debug(`publicGoodCandidatesAt1: ${await this.publicGoodCandidatesAt(1)}`)
            this.logger.debug(`geoCashingCandidatesAt0: ${await this.geoCashingCandidatesAt(0)}`)
            this.logger.debug(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)

        }

        if (clientInterestedIn.indexOf(EDataTypes.operationalData) > -1) {
            this.logger.info("\n\n*************************** Operational Data ***************************")
            this.logger.debug(`iCCounter: ${await this.iCCounter()}`)
            this.logger.debug(`pGCCounter: ${await this.pGCCounter()}`)
            this.logger.debug(`gCCCounter: ${await this.gCCCounter()}`)
            this.logger.debug(`iCIDsAtFC: ${await this.iCIDAt(Helper.FC)}`)
            this.logger.debug(`pGCIDsAtOPDonations: ${await this.pGCIDAt(Helper.FC)}`)
            this.logger.debug(`gCCIDsAtVitalik: ${await this.gCCIDAt(Helper.FC)}`)
            this.logger.debug(`poolAddress: ${await this.getPoolAddress(Helper.WETH, Helper.UNI, 3000)}`)
            this.logger.debug(`investmentPriceForAsset: ${await this.investmentPriceForAsset(Helper.CULT, await this.getPoolAddress(Helper.WETH, Helper.UNI, 3000))}`)
            this.logger.debug(`amountOutMinimum: ${await this.amountOutMinimum(Helper.WETH, Helper.UNI, Helper.convertToWei(9), 3000, 30)}`)
            this.logger.debug(`allowance from contract to router: ${await this.allowance(Helper.FC, Helper.ROUTER)}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.pricingData) > -1) {
            this.logger.info("\n\n*************************** Pricing Data ***************************")
            this.logger.debug(`buyPrice: ${await this.buyPrice(Helper.convertToWei(9))}`)
            this.logger.debug(`sellPrice: ${await this.sellPrice()}`)
        }
    }

}
