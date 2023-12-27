import { ethers } from 'npm:ethers';
import { BlockchainHelper } from './helpers/blockchain-helper.ts';

export class FundamentalsProvider {

    private blockchainHelper: BlockchainHelper 
    private provider: any
    private contract: any

    public constructor(helper: BlockchainHelper) {
        this.blockchainHelper = helper
        this.provider = this.blockchainHelper.getProvider()
        this.contract = this.blockchainHelper.getContract()        
    } 

    public async readAndLogMasterData(): Promise<void> {
        console.log("\n\n*************************** Master Data ***************************")
        const factoryAddress = await this.contract.factoryAddress()
        const decimals = await this.contract.decimals()
        const routerAddress = await this.contract.routerAddress()
        const symbol = await this.contract.symbol()
        const totalSupply = await this.contract.totalSupply()
        const wethAddress = await this.contract.wethAddress()
        console.log(`smartContractAddress: ${BlockchainHelper.FC}`)
        console.log(`totalSupply: ${totalSupply}`)
        console.log(`symbol: ${symbol}`)
        console.log(`decimals: ${decimals}`)
        console.log(`routerAddress: ${routerAddress}`)
        console.log(`factoryAddress: ${factoryAddress}`)
        console.log(`wethAddress: ${wethAddress}`)
    }

    public async readAndLogBudgetData(): Promise<void> {
        console.log("\n\n*************************** Budget Data ***************************")
        const amountRaw = (await this.provider.getBalance(BlockchainHelper.FC)).toString()
        const amountOfETHInSmartContract = ethers.formatUnits(amountRaw, 'ether');
        const balanceOf = await this.contract.balanceOf(BlockchainHelper.FC)
        const geoCashingBudget = await this.contract.geoCashingBudget()
        const publicGoodsFundingBudget = await this.contract.publicGoodsFundingBudget()
        const investmentBudget = await this.contract.investmentBudget()
        console.log(`amountOfETHInSmartContract: ${amountOfETHInSmartContract}`)
        console.log(`balanceOf Smart Contract: ${balanceOf}`)
        console.log(`investmentBudget: ${investmentBudget}`)
        console.log(`publicGoodsFundingBudget: ${publicGoodsFundingBudget}`)
        console.log(`geoCashingBudget: ${geoCashingBudget}`)        
    }

    public async readAndLogGamingData(): Promise<void> {
        console.log("\n\n*************************** Gaming Data ***************************")
        const addressOfHighestSoFarInvestment = await this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("investmentBet"))
        const addressOfHighestSoFarPublicGood = await this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("publicGoodsFunding"))
        const addressOfHighestSoFarGeoCash = await this.contract.getAddressOfHighestSoFar(ethers.encodeBytes32String("geoCashing"))
        console.log(`addressOfHighestSoFarInvestment: ${addressOfHighestSoFarInvestment}`)
        console.log(`addressOfHighestSoFarPublicGood: ${addressOfHighestSoFarPublicGood}`)
        console.log(`addressOfHighestSoFarGeoCash: ${addressOfHighestSoFarGeoCash}`)        
    }

    public async readAndLogOperationalData(): Promise<void> {
        console.log("\n\n*************************** Operational Data ***************************")
        const poolAddress = await this.contract.getPoolAddress(BlockchainHelper.WETH, BlockchainHelper.UNI, 3000)
        const investmentPriceForAsset = await this.contract.getInvestmentPriceForAsset(BlockchainHelper.WETH, poolAddress)
        const amountOutMinimum = await this.contract.getAmountOutMinimum(BlockchainHelper.WETH, BlockchainHelper.UNI, 9 * 10 ** 9, 3000, 30)
        const gCCCounter = await this.contract.gCCCounter()
        const pGCCounter = await this.contract.iCCounter()
        const iCCounter = await this.contract.iCCounter()
        const geoCashingCandidatesAt0 = await this.contract.geocashingCandidates(0)
        const geoCashingCandidatesAt1 = await this.contract.geocashingCandidates(1)
        const investmentCandidatesAt0 = await this.contract.investmentCandidates(0)
        const investmentCandidatesAt1 = await this.contract.investmentCandidates(1)
        const publicGoodCandidatesAt0 = await this.contract.publicGoodCandidates(0)
        const publicGoodCandidatesAt1 = await this.contract.publicGoodCandidates(1)
        const iCIDsAtCULT = await this.contract.iCIDs("0xf0f9D895aCa5c8678f706FB8216fa22957685A13")
        const pGCIDsAtOPDonations = await this.contract.pGCIDs("0x2D1bEB3e41D90d7F9756e92c3061265206a661A2")
        const gCCIDsAtVitalik = await this.contract.gCCIDs("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
        const allowance = await this.contract.allowance("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", BlockchainHelper.FC)
        console.log(`iCCounter: ${iCCounter}`)
        console.log(`pGCCounter: ${pGCCounter}`)
        console.log(`gCCCounter: ${gCCCounter}`)
        console.log(`iCIDsAtCULT: ${iCIDsAtCULT}`)
        console.log(`pGCIDsAtOPDonations: ${pGCIDsAtOPDonations}`)
        console.log(`gCCIDsAtVitalik: ${gCCIDsAtVitalik}`)
        console.log(`investmentPriceForAsset: ${investmentPriceForAsset}`)
        console.log(`amountOutMinimum: ${amountOutMinimum}`)
        console.log(`investmentCandidatesAt0: ${investmentCandidatesAt0}`)
        console.log(`investmentCandidatesAt1: ${investmentCandidatesAt1}`)
        console.log(`publicGoodCandidatesAt0: ${publicGoodCandidatesAt0}`)
        console.log(`publicGoodCandidatesAt1: ${publicGoodCandidatesAt1}`)
        console.log(`geoCashingCandidatesAt0: ${geoCashingCandidatesAt0}`)
        console.log(`geoCashingCandidatesAt1: ${geoCashingCandidatesAt1}`)
        console.log(`allowance: ${allowance}`)                
    }

    public async readAndLogPricingData(): Promise<void> {
        console.log("\n\n*************************** Pricing Data ***************************")
        const buyPrice = await this.contract.getBuyPrice(1000000000000000) // wei
        const sellPrice = await this.contract.getSellPrice()
        console.log(`buyPrice: ${buyPrice}`)
        console.log(`sellPrice: ${sellPrice}`)
    }
}