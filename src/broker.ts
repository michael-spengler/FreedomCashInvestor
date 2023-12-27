import { ethers } from 'npm:ethers';
import { Helper } from './helper.ts'
import { BlockchainHelper } from './helpers/blockchain-helper.ts';

export class Broker {

    private helper: Helper 
    private provider: any
    private contract: any

    public constructor(helper: Helper) {
        this.helper = helper
        this.provider = this.helper.getProvider()
        this.contract = this.helper.getContract()        
    } 

    public async voteForInvestment() {
        const aToBeBought = BigInt(999);
        let aToBeBoughtInWei = BigInt(ethers.parseEther(aToBeBought.toString()));
        const bPrice = BigInt(await this.contract.getBuyPrice(aToBeBoughtInWei));
        const bcost = aToBeBought * bPrice;
        let transaction = await this.contract.voteForInvestmentIn(BlockchainHelper.UNI, bPrice, aToBeBoughtInWei, { value: bcost })
        await transaction.wait()

        console.log(Number(bcost))


    }

    public async executeCommunityInvestment() {
        const amountOutMinimum = 
        await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, BigInt(3 * 10 ** 15), 3000, 30)
        console.log(Number(amountOutMinimum))

        try {
            const txObject = await this.contract.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30);
            const gasLimit = await this.provider.estimateGas(txObject.data);
            const gasPrice = (await this.provider.getGasPrice()) * 9;
            let result = await this.contract.executeCommunityInvestment(BlockchainHelper.UNI, 3000, 30, { gasLimit, gasPrice });
            console.log(`result: ${result}`);
        } catch (error) {
            alert(error.message);
        }
    }
}




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
    // const sellPrice = await contract.getSellPrice()
    // txs.push(await contract.sellFreedomCash(ethers.parseEther("1"), sellPrice))




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


    // const contractWithTestWalletAsSigner = new ethers.Contract(smartContractAddress, freedomCashABI, testWallet);




        // pa 0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801
        // ipForAsset 0,003098397989138930
        // with maxSlip 0:  968242301510699300
        // with maxSlip 30: 997289570556020200