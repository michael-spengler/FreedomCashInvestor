import { ethers, Logger } from '../deps.ts';
import { Helper } from './helper.ts';
import { EDataTypes, WETH, FC } from './monique-baumann.ts';

export class Broker {

    public static instance

    public static async getInstance(): Promise<Broker> {
        if (Broker.instance === undefined) {
            const logger = await Helper.getLogger()
            const helper = await Helper.getInstance()
            Broker.instance = new Broker(helper, logger)
        }
        return Broker.instance

    }

    private helper: Helper
    private provider: any
    private contract: any
    private logger: Logger

    private constructor(helper: Helper, logger: Logger) {
        this.helper = helper
        this.provider = this.helper.getProvider()
        this.contract = this.helper.getContract()
        this.logger = logger
    }

    public async voteFor(voteType: string, asset: string, amountToBeBought: number, text?: string): Promise<void> {
        this.logger.info(`\nvoting for ${voteType} for asset ${asset} with amountToBeBought ${amountToBeBought}`)
        let balance = await this.contract.balanceOf(FC)
        this.logger.debug(`sc balance before: ${ethers.formatEther(balance)}`)
        const amountInWei = ethers.parseEther(amountToBeBought.toString())
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
        balance = await this.contract.balanceOf(FC)
        this.logger.debug(`sc balance after : ${ethers.formatEther(balance)}`)
    }

    public async sellFreedomCash(amount: number): Promise<void> {
        this.logger.info("\nselling Freedom Cash")
        let balance = await this.contract.balanceOf(FC)
        if (balance === await this.contract.totalSupply()) {
            this.logger.warning("the game did not even start")
        } else {
            this.logger.debug(`sc balance before: ${ethers.formatEther(balance)}`)
            const sellPrice = await this.contract.getSellPrice()
            await this.contract.sellFreedomCash((ethers.parseEther(amount.toString())), sellPrice)
            balance = await this.contract.balanceOf(FC)
            this.logger.info(`sc balance after : ${ethers.formatEther(balance)}`)
        }
    }
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            this.logger.info(`\ncommunity investing into ${asset}`)
            const tx = await this.contract.executeCommunityInvestment(asset, poolFee, maxSlip);
            await tx.wait()
        } catch (error) {
            this.logger.error(error.message);
        }
    }
    public async getAssetContract(asset: string) {
        return this.helper.getAssetContract(asset)
    }
    public async takeProfits(asset: string, amount: bigint, poolFee: number, maxSlip: number): Promise<void> {
        let decimalsOfAsset = await (await this.helper.getAssetContract(asset)).decimals()
        const amountInWei = BigInt(amount) * (BigInt(10) ** decimalsOfAsset)
        const poolAddress = await this.getPoolAddress(asset, WETH, 3000)
        const price = await this.getPriceForInvestment(WETH, poolAddress)
        const amountOutMinimum = await this.getAmountOutMinimum(asset, amountInWei, price, maxSlip)
        this.logger.info(`\ntaking profits selling ${amount} ${asset} (${amountInWei}) at ${price} to receive at least: ${amountOutMinimum} ${WETH}`)
        try {
            const tx = await this.contract.takeProfits(asset, amountInWei, poolFee, maxSlip);
            await tx.wait()
        } catch (error) {
            alert(error.message);
        }
    }
    public async getBuyPrice(amountToBeBought: number): Promise<BigInt> {
        let aToBeBoughtInWei = BigInt(ethers.parseEther(amountToBeBought.toString()));
        return BigInt(await this.contract.getBuyPrice(aToBeBoughtInWei));
    }
    public async getSellPrice(): Promise<any> {
        return this.contract.getSellPrice()
    }
    public async factoryAddress(): Promise<any> {
        return this.contract.factoryAddress()
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
        // return ethers.formatEther(this.provider.getBalance(FC).toString())
        return this.provider.getBalance(FC)
    }
    public async balanceOf(): Promise<any> {
        return this.contract.balanceOf(FC)
    }
    public async geoCashingBudget(): Promise<any> {
        return this.contract.geoCashingBudget()
    }
    public async liquidityBudget(): Promise<any> {
        return this.contract.liquidityBudget()
    }
    public async pubGoodsFundingBudget(): Promise<any> {
        return this.contract.pubGoodsFundingBudget()
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
    public async getPoolAddress(tIn: string, tOut: string, poolFee: number): Promise<any> {
        return this.contract.getPoolAddress(tIn, tOut, poolFee)
    }
    public async getPriceForInvestment(asset: string, poolAddress: string): Promise<any> {
        return this.contract.getPriceForInvestment(asset, poolAddress)
    }
    public async getAmountOutMinimum(tIn: string, amount: bigint, price: bigint, maxSlip: number): Promise<any> {
        return this.contract.getAmountOutMinimum(tIn, amount, price, maxSlip)
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
    public async pubGoodCandidatesAt(index: number): Promise<any> {
        return this.contract.pubGoodCandidates(index)
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
    public async logFundamentals(clientInterestedIn: EDataTypes[]): Promise<void> {

        if (clientInterestedIn.indexOf(EDataTypes.masterData) > -1) {
            this.logger.info("\n\n*************************** Master Data ***************************")
            this.logger.debug(`smartContractAddress: ${FC}`)
            this.logger.debug(`totalSupply: ${ethers.formatEther(await this.totalSupply())}`)
            this.logger.debug(`symbol: ${await this.symbol()}`)
            this.logger.debug(`routerAddress: ${await this.routerAddress()}`)
            this.logger.debug(`factoryAddress: ${await this.factoryAddress()}`)
            this.logger.debug(`wethAddress: ${await this.wethAddress()}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.budgetData) > -1) {
            this.logger.info("\n\n*************************** Budget Data ***************************")
            this.logger.debug(`amountOfETHInSmartContract: ${ethers.formatEther(await this.amountOfETHInSmartContract())}`)
            this.logger.debug(`balanceOf Smart Contract: ${ethers.formatEther(await this.balanceOf())}`)
            this.logger.debug(`investmentBudget: ${ethers.formatEther(await this.investmentBudget())}`)
            this.logger.debug(`pubGoodsFundingBudget: ${ethers.formatEther(await this.pubGoodsFundingBudget())}`)
            this.logger.debug(`geoCashingBudget: ${ethers.formatEther(await this.geoCashingBudget())}`)
            this.logger.debug(`liquidityBudget: ${ethers.formatEther(await this.liquidityBudget())}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.gamingData) > -1) {
            this.logger.info("\n\n*************************** Gaming Data ***************************")
            this.logger.debug(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
            this.logger.debug(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
            this.logger.debug(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)
            this.logger.debug(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
            this.logger.debug(`pubGoodCandidatesAt1: ${await this.pubGoodCandidatesAt(1)}`)
            this.logger.debug(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)

        }

        if (clientInterestedIn.indexOf(EDataTypes.operationalData) > -1) {
            this.logger.info("\n\n*************************** Operational Data ***************************")
            this.logger.debug(`iCCounter: ${await this.iCCounter()}`)
            this.logger.debug(`pGCCounter: ${await this.pGCCounter()}`)
            this.logger.debug(`gCCCounter: ${await this.gCCCounter()}`)
            this.logger.debug(`iCIDsAtFC: ${await this.iCIDAt(FC)}`)
            this.logger.debug(`pGCIDsAtOPDonations: ${await this.pGCIDAt(FC)}`)
            this.logger.debug(`gCCIDsAtVitalik: ${await this.gCCIDAt(FC)}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.pricingData) > -1) {
            this.logger.info("\n\n*************************** Pricing Data ***************************")
            this.logger.debug(`buyPrice: ${ethers.formatEther(await this.getBuyPrice(1))}`)
            try {
                this.logger.debug(`sellPrice: ${ethers.formatEther(await this.getSellPrice())}`)
            } catch (error) {
                this.logger.warning(`could not determine a sell price atm`)
            }
        }
    }

}
