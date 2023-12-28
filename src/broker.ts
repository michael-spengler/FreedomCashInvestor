import { ethers } from 'npm:ethers';
import { BlockchainHelper } from './helpers/blockchain-helper.ts';
import { Logger } from 'https://deno.land/x/log/mod.ts'

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
        this.logger.info(`sc balance before: ${balance}`)
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
        this.logger.info(`sc balance after : ${balance}`)
    }

    public async sellFreedomCash(amount: number): Promise<void> {
        this.logger.info("selling Freedom Cash")
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.info(`sc balance before: ${balance}`)
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash((this.bcHelper.convertToWei(amount)), sellPrice)
        balance = await this.contract.balanceOf(BlockchainHelper.FC)
        this.logger.info(`sc balance after : ${balance}`)
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        this.logger.info("executing community investment")
        // const amountOutMinimum = 
        // await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, BigInt(3 * 10 ** 15), 3000, 30)
        // this.logger.info(Number(amountOutMinimum))
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            this.logger.info("ho")
            // const gasPrice = (await this.provider.getGasPrice()) * 9;
            this.logger.info("hi")
            let result = await this.contract.executeCommunityInvestment(BlockchainHelper.UNI, poolFee, maxSlip);
            this.logger.info(`result: ${result}`);
        } catch (error) {
            alert(error.message);
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
            // this.logger.info(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }
    }
    public async getAmountOutMinimum(assetIn: string, assetOut: string, amountIn: number, poolFee: number, maxSlip: number): Promise<number> {
        const amountOutMin =
            await this.contract.getAmountOutMinimum(assetIn, assetOut, amountIn, poolFee, maxSlip)
        this.logger.info(`amountOutMin: ${amountOutMin}`)
        return amountOutMin
    }
    public async swipSwapV3Service(): Promise<void> {
        this.logger.info("using the SwipSwapV3Service")
        return
    }
    public async sendETHWithMessage(target: string, message: string, amount: number): Promise<void> {
        this.logger.info("sending ETH with Message")
        const encodedMessage = ethers.encodeBytes32String(message)
        await this.contract.sendETHWithMessage(encodedMessage, { value: BigInt(amount) })

    }
    public async getBuyPrice(amountToBeBought: number): Promise<BigInt> {
        const aToBeBought = BigInt(amountToBeBought);
        let aToBeBoughtInWei = BigInt(ethers.parseEther(aToBeBought.toString()));

        return BigInt(await this.contract.getBuyPrice(aToBeBoughtInWei));
    }
    public async getInvestmentBudget(): Promise<number> {
        const investmentBudget =
            ethers.formatEther((await this.contract.investmentBudget()).toString())
        this.logger.info(`investmentBudget: ${investmentBudget}`)
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

        this.logger.info("\n\n*************************** Master Data ***************************")
        this.logger.info(`smartContractAddress: ${BlockchainHelper.FC}`)
        this.logger.info(`totalSupply: ${await this.totalSupply()}`)
        this.logger.info(`symbol: ${await this.symbol()}`)
        this.logger.info(`decimals: ${await this.decimals()}`)
        this.logger.info(`routerAddress: ${await this.routerAddress()}`)
        this.logger.info(`factoryAddress: ${await this.factoryAddress()}`)
        this.logger.info(`wethAddress: ${await this.wethAddress()}`)

        this.logger.info("\n\n*************************** Budget Data ***************************")
        this.logger.info(`amountOfETHInSmartContract: ${await this.amountOfETHInSmartContract()}`)
        this.logger.info(`balanceOf Smart Contract: ${await this.balanceOf()}`)
        this.logger.info(`investmentBudget: ${await this.investmentBudget()}`)
        this.logger.info(`publicGoodsFundingBudget: ${await this.publicGoodsFundingBudget()}`)
        this.logger.info(`geoCashingBudget: ${await this.geoCashingBudget()}`)

        this.logger.info("\n\n*************************** Gaming Data ***************************")
        this.logger.info(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
        this.logger.info(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
        this.logger.info(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)

        this.logger.info("\n\n*************************** Operational Data ***************************")
        this.logger.info(`iCCounter: ${await this.iCCounter()}`)
        this.logger.info(`pGCCounter: ${await this.pGCCounter()}`)
        this.logger.info(`gCCCounter: ${await this.gCCCounter()}`)
        this.logger.info(`iCIDsAtFC: ${await this.iCIDAt(BlockchainHelper.FC)}`)
        this.logger.info(`pGCIDsAtOPDonations: ${await this.pGCIDAt(BlockchainHelper.FC)}`)
        this.logger.info(`gCCIDsAtVitalik: ${await this.gCCIDAt(BlockchainHelper.FC)}`)
        this.logger.info(`poolAddress: ${await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000)}`)
        this.logger.info(`investmentPriceForAsset: ${await this.investmentPriceForAsset(BlockchainHelper.CULT, await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000))}`)
        this.logger.info(`amountOutMinimum: ${await this.amountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, this.bcHelper.convertToWei(9), 3000, 30)}`)
        this.logger.info(`investmentCandidatesAt0: ${await this.investmentCandidatesAt(0)}`)
        this.logger.info(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
        this.logger.info(`publicGoodCandidatesAt0: ${await this.publicGoodCandidatesAt(0)}`)
        this.logger.info(`publicGoodCandidatesAt1: ${await this.publicGoodCandidatesAt(1)}`)
        this.logger.info(`geoCashingCandidatesAt0: ${await this.geoCashingCandidatesAt(0)}`)
        this.logger.info(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)
        this.logger.info(`allowance from contract to router: ${await this.allowance(BlockchainHelper.FC, BlockchainHelper.ROUTER)}`)

        this.logger.info("\n\n*************************** Pricing Data ***************************")
        this.logger.info(`buyPrice: ${await this.buyPrice(this.bcHelper.convertToWei(9))}`)
        this.logger.info(`sellPrice: ${await this.sellPrice()}`)
    }

}
