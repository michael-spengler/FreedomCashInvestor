import { ethers } from 'npm:ethers@6.9.1';
import { BlockchainHelper } from './helpers/blockchain-helper.ts';
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'

export class Broker {

    private bcHelper: BlockchainHelper
    private provider: any
    private contract: any
    private logger: Logger

    public constructor(bcHelper: BlockchainHelper, logger: Logger) {
        this.bcHelper = bcHelper
        this.provider = this.bcHelper.getProvider()
        this.contract = this.bcHelper.getContract()
        this.logger = logger
    }

    public async voteFor(voteType: string, asset: string, amountToBeBought: number, text?: string): Promise<void> {
        this.logger.info(`voting for ${voteType}`)
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.debug(`sc balance before: ${balance}`)
        const amountInWei = this.bcHelper.convertToWei(amountToBeBought)
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
        balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.debug(`sc balance after : ${balance}`)
    }

    public async sellFreedomCash(amount: number): Promise<void> {
        this.logger.info("selling Freedom Cash")
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.debug(`sc balance before: ${balance}`)
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash((this.bcHelper.convertToWei(amount)), sellPrice)
        balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.info(`sc balance after : ${balance}`)
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        this.logger.info("executing community investment")
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            let result = await this.contract.executeCommunityInvestment(BlockchainHelper.UNI, poolFee, maxSlip);
            this.logger.debug(`result: ${result}`);
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    public async takeProfits(asset: string, amount: number, poolFee: number, maxSlip: number): Promise<void> {
        this.logger.info("taking profits")
        const buyPrice = await this.contract.getBuyPrice(this.bcHelper.convertToWei(amount))
        const sellPrice = await this.contract.getSellPrice()
        if ((sellPrice + (sellPrice * (BigInt(amount) / BigInt(100)))) > buyPrice) {
            throw new Error("no need to sell atm")
        }
        try {
            // await this.contract.takeProfits(asset, BigInt(amount), poolFee, maxSlip);
            // const gasLimit = await this.provider.estimateGas(txObject.data);
            // const gasPrice = (await this.provider.getGasPrice()) * 9;
            // let result = await this.contract.takeProfits(asset, BigInt(amount), poolFee, maxSlip, { gasLimit, gasPrice });
            // this.logger.debug(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }
    }
    public async getAmountOutMinimum(assetIn: string, assetOut: string, amountIn: number, poolFee: number, maxSlip: number): Promise<number> {
        const amountOutMin =
            await this.contract.getAmountOutMinimum(assetIn, assetOut, amountIn, poolFee, maxSlip)
        this.logger.debug(`amountOutMin: ${amountOutMin}`)
        return amountOutMin
    }
    public async swipSwapV3Service(tIn: string, tOut: string, amount: number, poolFee: number, maxSlip: number): Promise<void> {
        
        const amountInWei = this.bcHelper.convertToWei(amount)
        const amountOutMinimum = 
        await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, amountInWei, poolFee, maxSlip)
        this.logger.debug(`using the SwipSwapV3Service to swap ${amount} ${tIn} to ${tOut} with minimum output ${amountOutMinimum}, poolFee: ${poolFee}, maxSlip: ${maxSlip}`)
        try {
            let result = await this.contract.swipSwapV3Service(tIn, tOut, poolFee, amountOutMinimum, {value: amountInWei});
        } catch (error) {
            this.logger.error(error.message);
        }

        // const gasPrice = (await this.provider.getGasPrice()) * 9;

    }
    public async sendETHWithMessage(target: string, message: string, amount: number): Promise<void> {
        const encodedMessage = ethers.encodeBytes32String(message)
        const amountInWei = this.bcHelper.convertToWei(amount)
        this.logger.debug(`sending ${amount} ETH (${amountInWei}) WEI with Message: ${message}`)
        // await this.contract.sendETHWithMessage(target, encodedMessage, { value: BigInt(amountInWei) })
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
        // return ethers.formatEther(this.provider.getBalance(BlockchainHelper.FC).toString())
        return this.provider.getBalance(BlockchainHelper.FC)
    }
    public async balanceOf(): Promise<any> {
        return this.contract.balanceOf(BlockchainHelper.FC)
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
        return this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, amount, poolFee, maxSlip)
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
        return this.contract.getBuyPrice(this.bcHelper.convertToWei(amountToBeBought))
    }
    public async sellPrice(): Promise<any> {
        return this.contract.getSellPrice()
    }
    public async getPoolAddress(tIn: string, tOut: string, poolFee: number): Promise<any> {
        return this.contract.getPoolAddress(tIn, tOut, poolFee)
    }

    public async logFundamentals(): Promise<void> {

        this.logger.info("\n\n*************************** Checking Master Data ***************************")
        this.logger.debug(`smartContractAddress: ${BlockchainHelper.FC}`)
        this.logger.debug(`totalSupply: ${await this.totalSupply()}`)
        this.logger.debug(`symbol: ${await this.symbol()}`)
        this.logger.debug(`decimals: ${await this.decimals()}`)
        this.logger.debug(`routerAddress: ${await this.routerAddress()}`)
        this.logger.debug(`factoryAddress: ${await this.factoryAddress()}`)
        this.logger.debug(`wethAddress: ${await this.wethAddress()}`)

        this.logger.info("\n\n*************************** Checking Budget Data ***************************")
        this.logger.debug(`amountOfETHInSmartContract: ${await this.amountOfETHInSmartContract()}`)
        this.logger.debug(`balanceOf Smart Contract: ${await this.balanceOf()}`)
        this.logger.debug(`investmentBudget: ${await this.investmentBudget()}`)
        this.logger.debug(`publicGoodsFundingBudget: ${await this.publicGoodsFundingBudget()}`)
        this.logger.debug(`geoCashingBudget: ${await this.geoCashingBudget()}`)

        this.logger.info("\n\n*************************** Checking Gaming Data ***************************")
        this.logger.debug(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
        this.logger.debug(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
        this.logger.debug(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)

        this.logger.info("\n\n*************************** Checking Operational Data ***************************")
        this.logger.debug(`iCCounter: ${await this.iCCounter()}`)
        this.logger.debug(`pGCCounter: ${await this.pGCCounter()}`)
        this.logger.debug(`gCCCounter: ${await this.gCCCounter()}`)
        this.logger.debug(`iCIDsAtFC: ${await this.iCIDAt(BlockchainHelper.FC)}`)
        this.logger.debug(`pGCIDsAtOPDonations: ${await this.pGCIDAt(BlockchainHelper.FC)}`)
        this.logger.debug(`gCCIDsAtVitalik: ${await this.gCCIDAt(BlockchainHelper.FC)}`)
        this.logger.debug(`poolAddress: ${await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000)}`)
        this.logger.debug(`investmentPriceForAsset: ${await this.investmentPriceForAsset(BlockchainHelper.CULT, await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000))}`)
        this.logger.debug(`amountOutMinimum: ${await this.amountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, this.bcHelper.convertToWei(9), 3000, 30)}`)
        this.logger.debug(`investmentCandidatesAt0: ${await this.investmentCandidatesAt(0)}`)
        this.logger.debug(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
        this.logger.debug(`publicGoodCandidatesAt0: ${await this.publicGoodCandidatesAt(0)}`)
        this.logger.debug(`publicGoodCandidatesAt1: ${await this.publicGoodCandidatesAt(1)}`)
        this.logger.debug(`geoCashingCandidatesAt0: ${await this.geoCashingCandidatesAt(0)}`)
        this.logger.debug(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)
        this.logger.debug(`allowance from contract to router: ${await this.allowance(BlockchainHelper.FC, BlockchainHelper.ROUTER)}`)

        this.logger.info("\n\n*************************** Checking Pricing Data ***************************")
        this.logger.debug(`buyPrice: ${await this.buyPrice(this.bcHelper.convertToWei(9))}`)
        this.logger.debug(`sellPrice: ${await this.sellPrice()}`)
    }

}
