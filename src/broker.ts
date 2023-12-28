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
        if (voteType == "investmentBet"){
            transaction = await this.contract.voteForInvestmentIn(asset, bPrice, amountInWei, { value: bcost })
        } else if (voteType == "publicGoodsFunding"){
             transaction = await this.contract.voteForPublicGood(asset, bPrice, amountInWei, { value: bcost })            
        } else if (voteType == "geoCashing"){
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
        const sellPrice = await this.contract.getSellPrice()
        await this.contract.sellFreedomCash(ethers.parseEther(amount.toString()), sellPrice)  
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        console.log("executing community investment")
        // const amountOutMinimum = 
        // await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, BigInt(3 * 10 ** 15), 3000, 30)
        // console.log(Number(amountOutMinimum))
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99*10**15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}` )
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
        const buyPrice = await this.contract.getBuyPrice(this.getAmountInWei(1))
        const sellPrice = await this.contract.getSellPrice()
        if ((sellPrice + (sellPrice * (BigInt(9) / BigInt(100)))) > buyPrice) { 
            throw new Error("no need to sell atm")
        }
        try {
            const txObject = await this.contract.takeProfits(asset, BigInt(amount), poolFee, maxSlip);
            // const gasLimit = await this.provider.estimateGas(txObject.data);
            // const gasPrice = (await this.provider.getGasPrice()) * 9;
            // let result = await this.contract.takeProfits(asset, BigInt(amount), poolFee, maxSlip, { gasLimit, gasPrice });
            // console.log(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }        
    }
    public async swipSwapV3Service(): Promise<void> {
        console.log("using the SwipSwapV3Service")
        return
    }
    public async sendETHWithMessage(target: string, message: string, amount: number): Promise<void> {
        console.log("sending ETH with Message")
        const encodedMessage = ethers.encodeBytes32String(message)
        await this.contract.sendETHWithMessage(encodedMessage, {value: BigInt(amount)})

    }
    public async getBuyPrice(amountToBeBought: number): Promise<BigInt> {
        const aToBeBought = BigInt(amountToBeBought);
        let aToBeBoughtInWei = BigInt(ethers.parseEther(aToBeBought.toString()));

        return BigInt(await this.contract.getBuyPrice(aToBeBoughtInWei));
    }
}

const bHelper = await BlockchainHelper.getInstance()
const broker = new Broker(bHelper)
const buyPrice = await broker.getBuyPrice(9)
console.log(buyPrice)
// await broker.sendETHWithMessage("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2", "super", 9)
await broker.voteFor("investmentBet", BlockchainHelper.UNI, 9999)
await broker.voteFor("publicGoodsFunding", BlockchainHelper.POD, 999)
await broker.voteFor("geoCashing", BlockchainHelper.VITALIK, 999, "geil")
await broker.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30)
// await broker.takeProfits(BlockchainHelper.UNI, 1000, 3000, 70)
// let transaction = await contractWithTestWalletAsSigner.voteForInvestmentIn(UNI, bPrice, aToBeBoughtInWei, { value: bcost })
    // await tx.wait()


    // txs.push(await contract.buyFreedomCash(buyPrice, amountToBeBoughtInWei, {value: BigInt(cost)}));

    // txs.push(await contract.voteForInvestmentIn(CULT, { value: ethers.parseUnits("270", "finney") }))
    // txs.push(await contract.voteForInvestmentIn(SHIB, { value: ethers.parseUnits("180", "finney") }))
    //   txs.push(await contract.voteForPublicGood("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2", { value: ethers.parseUnits("180", "finney") }))
    // txs.push(await contract.voteForPublicGood("0xe7aCE1F569AD68C44b6bcacB8B4B2DDa8893b4c3", { value: ethers.parseUnits("99", "finney") }))
    // txs.push(await contract.voteForGeoCash("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", { value: ethers.parseUnits("180", "finney") }))
    // txs.push(await contract.voteForGeoCash("0x5FDF0f97954cc22d23268D930e69DC7F53018261", { value: ethers.parseUnits("99", "finney") }))
    // let amountToBeBought = 2;
    // const amountToBeBoughtInWei = ethers.parseEther(amountToBeBought.toString());
    // const buyPrice = Number(await contract.getBuyPrice(amountToBeBoughtInWei));
    // const cost = amountToBeBought * buyPrice;
    // console.log(cost)
    // txs.push(await contract.buyFreedomCash(buyPrice, amountToBeBoughtInWei, {value: BigInt(cost)}));





    // txs.push(await contract.executeCommunityInvestment(ethers.parseUnits("99", "finney"), 3000, 200, false))

    // const gasPrice = await provider.getGasPrice();
    // console.log(gasPrice)

    //    const estimation =  await contract.estimateGas.executeCommunityInvestment(ethers.parseUnits("99", "finney"), 3000, 1000, true)
    //    console.log(estimation)
    // txs.push(await contract.executeCommunityInvestment(ethers.parseUnits("99", "finney"), 3000, 1000, true))

    // txs.push(await contract.takeProfits("0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", BigInt(9*10**15), 3000, 30))
    // txs.push(await contract.swipSwapV3Service("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", 3000, amountOutMinimum, {value: BigInt(9*10**15)}))
    // txs.push(await contract.addAccruedRoundingDifferenceToLiquidityPool())
    // txs.push(await contract.sendETHWithMessage("Monique Baumann buys and sells Freedom Cash"))

    // https://github.com/Uniswap/v2-periphery/issues/96

    // 99000000000000000

    // 2268931 333183675210471668







        // pa 0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801
        // ipForAsset 0,003098397989138930
        // with maxSlip 0:  968242301510699300
        // with maxSlip 30: 997289570556020200