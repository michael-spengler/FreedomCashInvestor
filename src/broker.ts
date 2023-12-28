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
        console.log(`voting for ${voteType}`)
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        console.log(`sc balance before: ${balance}`)
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
        console.log(`sc balance after : ${balance}`)
    }

    public async sellFreedomCash(amount: number): Promise<void> {
        console.log("selling Freedom Cash")
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        console.log(`sc balance before: ${balance}`)
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash((this.bcHelper.convertToWei(amount)), sellPrice)
        balance = await this.contract.balanceOf(BlockchainHelper.FC)
        console.log(`sc balance after : ${balance}`)
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        console.log("executing community investment")
        // const amountOutMinimum = 
        // await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, BigInt(3 * 10 ** 15), 3000, 30)
        // console.log(Number(amountOutMinimum))
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            console.log("ho")
            // const gasPrice = (await this.provider.getGasPrice()) * 9;
            console.log("hi")
            let result = await this.contract.executeCommunityInvestment(BlockchainHelper.UNI, poolFee, maxSlip);
            console.log(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }
    }

    public async takeProfits(asset: string, amount: number, poolFee: number, maxSlip: number): Promise<void> {
        console.log("taking profits")
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
            // console.log(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }
    }
    public async getAmountOutMinimum(assetIn: string, assetOut: string, amountIn: number, poolFee: number, maxSlip: number): Promise<number> {
        const amountOutMin =
            await this.contract.getAmountOutMinimum(assetIn, assetOut, amountIn, poolFee, maxSlip)
        console.log(`amountOutMin: ${amountOutMin}`)
        return amountOutMin
    }
    public async swipSwapV3Service(): Promise<void> {
        console.log("using the SwipSwapV3Service")
        return
    }
    public async sendETHWithMessage(target: string, message: string, amount: number): Promise<void> {
        console.log("sending ETH with Message")
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
        console.log(`investmentBudget: ${investmentBudget}`)
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

        console.log("\n\n*************************** Master Data ***************************")
        console.log(`smartContractAddress: ${BlockchainHelper.FC}`)
        console.log(`totalSupply: ${await this.totalSupply()}`)
        console.log(`symbol: ${await this.symbol()}`)
        console.log(`decimals: ${await this.decimals()}`)
        console.log(`routerAddress: ${await this.routerAddress()}`)
        console.log(`factoryAddress: ${await this.factoryAddress()}`)
        console.log(`wethAddress: ${await this.wethAddress()}`)

        console.log("\n\n*************************** Budget Data ***************************")
        console.log(`amountOfETHInSmartContract: ${await this.amountOfETHInSmartContract()}`)
        console.log(`balanceOf Smart Contract: ${await this.balanceOf()}`)
        console.log(`investmentBudget: ${await this.investmentBudget()}`)
        console.log(`publicGoodsFundingBudget: ${await this.publicGoodsFundingBudget()}`)
        console.log(`geoCashingBudget: ${await this.geoCashingBudget()}`)

        console.log("\n\n*************************** Gaming Data ***************************")
        console.log(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
        console.log(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
        console.log(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)

        console.log("\n\n*************************** Operational Data ***************************")
        console.log(`iCCounter: ${await this.iCCounter()}`)
        console.log(`pGCCounter: ${await this.pGCCounter()}`)
        console.log(`gCCCounter: ${await this.gCCCounter()}`)
        console.log(`iCIDsAtFC: ${await this.iCIDAt(BlockchainHelper.FC)}`)
        console.log(`pGCIDsAtOPDonations: ${await this.pGCIDAt(BlockchainHelper.FC)}`)
        console.log(`gCCIDsAtVitalik: ${await this.gCCIDAt(BlockchainHelper.FC)}`)
        console.log(`poolAddress: ${await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000)}`)
        console.log(`investmentPriceForAsset: ${await this.investmentPriceForAsset(BlockchainHelper.CULT, await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000))}`)
        console.log(`amountOutMinimum: ${await this.amountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, this.bcHelper.convertToWei(9), 3000, 30)}`)
        console.log(`investmentCandidatesAt0: ${await this.investmentCandidatesAt(0)}`)
        console.log(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
        console.log(`publicGoodCandidatesAt0: ${await this.publicGoodCandidatesAt(0)}`)
        console.log(`publicGoodCandidatesAt1: ${await this.publicGoodCandidatesAt(1)}`)
        console.log(`geoCashingCandidatesAt0: ${await this.geoCashingCandidatesAt(0)}`)
        console.log(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)
        console.log(`allowance from contract to router: ${await this.allowance(BlockchainHelper.FC, BlockchainHelper.ROUTER)}`)

        console.log("\n\n*************************** Pricing Data ***************************")
        console.log(`buyPrice: ${await this.buyPrice(this.bcHelper.convertToWei(9))}`)
        console.log(`sellPrice: ${await this.sellPrice()}`)
    }

}
