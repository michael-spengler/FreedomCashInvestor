import { ethers } from 'npm:ethers';
import { BlockchainHelper } from './helpers/blockchain-helper.ts';

export class Broker {

    private blockchainHelper: BlockchainHelper
    private provider: any
    private contract: any

    public constructor(blockchainHelper: BlockchainHelper) {
        this.blockchainHelper = blockchainHelper
        this.provider = this.blockchainHelper.getProvider()
        this.contract = this.blockchainHelper.getContract()
    }

    public async voteFor(voteType: string, asset: string, amountToBeBought: number, text?: string): Promise<void> {
        console.log(`voting for ${voteType}`)
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        console.log(`sc balance before: ${balance}`)
        const amountInWei = this.getAmountInWei(amountToBeBought)
        const bPrice = BigInt(await this.contract.getBuyPrice(amountInWei));
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

    public getAmountInWei(amountToBeBought: number): BigInt {
        return BigInt(ethers.parseEther(amountToBeBought.toString()));
    }
    public async sellFreedomCash(amount: number): Promise<void> {
        console.log("selling Freedom Cash")
        let balance = await this.contract.balanceOf(BlockchainHelper.FC)
        console.log(`sc balance before: ${balance}`)
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash((this.getAmountInWei(amount)), sellPrice)
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
        const buyPrice = await this.contract.getBuyPrice(this.getAmountInWei(amount))
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
        return ethers.formatEther(this.provider.getBalance(BlockchainHelper.FC).toString())
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
    public async geoCashingCandidatesAt0(): Promise<any> {
        return this.contract.geocashingCandidates(0)
    }
    public async geoCashingCandidatesAt1(): Promise<any> {
        return this.contract.geocashingCandidates(1)
    }
    public async investmentCandidatesAt0(): Promise<any> {
        return this.contract.investmentCandidates(0)
    }
    public async investmentCandidatesAt1(): Promise<any> {
        return this.contract.investmentCandidates(1)
    }
    public async publicGoodCandidatesAt0(): Promise<any> {
        return this.contract.publicGoodCandidates(0)
    }
    public async publicGoodCandidatesAt1(): Promise<any> {
        return this.contract.publicGoodCandidates(1)
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
    public async buyPrice(amountToBeBought: BigInt): Promise<any> {
        return this.contract.getBuyPrice(amountToBeBought) // wei
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
        console.log(`totalSupply: ${this.totalSupply()}`)
        console.log(`symbol: ${this.symbol()}`)
        console.log(`decimals: ${this.decimals()}`)
        console.log(`routerAddress: ${this.routerAddress()}`)
        console.log(`factoryAddress: ${this.factoryAddress()}`)
        console.log(`wethAddress: ${this.wethAddress()}`)

        console.log("\n\n*************************** Budget Data ***************************")
        console.log(`amountOfETHInSmartContract: ${this.amountOfETHInSmartContract()}`)
        console.log(`balanceOf Smart Contract: ${this.balanceOf()}`)
        console.log(`investmentBudget: ${this.investmentBudget()}`)
        console.log(`publicGoodsFundingBudget: ${this.publicGoodsFundingBudget()}`)
        console.log(`geoCashingBudget: ${this.geoCashingBudget()}`)

        console.log("\n\n*************************** Gaming Data ***************************")
        console.log(`addressOfHighestSoFarInvestment: ${this.addressOfHighestSoFarInvestment()}`)
        console.log(`addressOfHighestSoFarPublicGood: ${this.addressOfHighestSoFarPublicGood()}`)
        console.log(`addressOfHighestSoFarGeoCash: ${this.addressOfHighestSoFarGeoCash()}`)

        console.log("\n\n*************************** Operational Data ***************************")
        console.log(`iCCounter: ${this.iCCounter()}`)
        console.log(`pGCCounter: ${this.pGCCounter()}`)
        console.log(`gCCCounter: ${this.gCCCounter()}`)
        console.log(`iCIDsAtCULT: ${this.iCIDAt("asdf")}`)
        console.log(`pGCIDsAtOPDonations: ${this.pGCIDAt("asdf")}`)
        console.log(`gCCIDsAtVitalik: ${this.gCCIDAt("asdf")}`)
        console.log(`poolAddress: ${this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000)}`)
        console.log(`investmentPriceForAsset: ${this.investmentPriceForAsset("asdf", await this.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000))}`)
        console.log(`amountOutMinimum: ${this.amountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, BigInt(9), 3000, 30)}`)
        console.log(`investmentCandidatesAt0: ${this.investmentCandidatesAt0()}`)
        console.log(`investmentCandidatesAt1: ${this.investmentCandidatesAt1()}`)
        console.log(`publicGoodCandidatesAt0: ${this.publicGoodCandidatesAt0()}`)
        console.log(`publicGoodCandidatesAt1: ${this.publicGoodCandidatesAt1()}`)
        console.log(`geoCashingCandidatesAt0: ${this.geoCashingCandidatesAt0()}`)
        console.log(`geoCashingCandidatesAt1: ${this.geoCashingCandidatesAt1()}`)
        console.log(`allowance from contract to router: ${this.allowance(BlockchainHelper.FC, BlockchainHelper.routerAddress)}`)

        console.log("\n\n*************************** Pricing Data ***************************")
        console.log(`buyPrice: ${this.buyPrice(BigInt(9))}`)
        console.log(`sellPrice: ${this.sellPrice()}`)
    }

}

const bHelper = await BlockchainHelper.getInstance()
const broker = new Broker(bHelper)
const buyPrice = await broker.getBuyPrice(9)
console.log(buyPrice)
await broker.getInvestmentBudget()
// await broker.sendETHWithMessage("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2", "super", 9)
// await broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
// await broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
// await broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
//await broker.sellFreedomCash(999)

// await broker.takeProfits(BlockchainHelper.UNI, 31, 3000, 0)

// await broker.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, 31, 3000, 30)
// await broker.getAmountOutMinimum(BlockchainHelper.UNI, BlockchainHelper.WETH, 31, 3000, 30)
// let transaction = await contractWithTestWalletAsSigner.voteForInvestmentIn(UNI, bPrice, aToBeBoughtInWei, { value: bcost })
// await tx.wait()
