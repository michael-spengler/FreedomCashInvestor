import { ethers, Logger } from '../deps.ts';
import { EDataTypes } from './constants-types-infrastructure.ts';

export class Broker {

    public static instance

    public static async getInstance(logger: Logger, contract: any, provider: any): Promise<Broker> {
        if (Broker.instance === undefined) {

            Broker.instance = new Broker(logger, contract, provider)
        }
        return Broker.instance
    }



    private provider: any
    private contract: any
    private logger: Logger

    private constructor(logger: Logger, contract: any, provider: any) {
        this.contract = contract
        this.logger = logger
        this.provider = provider

    }

    public async voteFor(voteType: string, asset: string, amountToBeBought: number, text?: string) {
        this.logger.info(`\nvoting for ${voteType} for asset ${asset} with amountToBeBought ${amountToBeBought}`)
        const amountInWei = ethers.parseEther(amountToBeBought.toString())
        const bPrice = await this.contract.getBuyPrice(amountInWei);
        const bcost = BigInt(amountToBeBought) * bPrice;
        let transaction
        if (voteType == "investmentBet") {
            this.logger.info(`\ncalling contract with ${asset} ${bPrice} ${amountInWei} ${bcost}`)
            transaction = await this.contract.voteForInvestmentIn(asset, bPrice, amountInWei, { value: bcost })
        } else if (voteType == "publicGoodsFunding") {
            this.logger.info(`\ncalling contract with ${asset} ${bPrice} ${amountInWei} ${bcost}`)
            transaction = await this.contract.voteForPublicGood(asset, bPrice, amountInWei, { value: bcost })
        } else if (voteType == "geoCashing") {
            this.logger.info(`\ncalling contract with ${asset} ${text} ${bPrice} ${amountInWei} ${bcost}`)
            transaction = await this.contract.voteForGeoCash(asset, text, bPrice, amountInWei, { value: bcost })
        }
        return transaction
    }

    public async sellFreedomCash(amount: number) {
        this.logger.info("\nselling Freedom Cash")
        const sellPrice = await this.contract.getSellPrice()
        const paraAmount = ethers.parseEther(amount.toString())
        this.logger.info(`\ncalling contract with ${amount} ${sellPrice}`)
        return this.contract.sellFreedomCash(paraAmount, sellPrice)
    }
    
    public async executeCommunityInvestment(asset: string, poolFee: number, maxSlip: number) {
        const investmentBudget = await this.contract.investmentBudget()
        if (investmentBudget < BigInt(99 * 10 ** 15)) {
            throw new Error(`investment budget only at ${BigInt(investmentBudget)}`)
        }
        try {
            this.logger.info(`\ncalling contract with ${asset} ${poolFee} ${maxSlip}`)
            return this.contract.executeCommunityInvestment(asset, poolFee, maxSlip);
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    public async takeProfits(sellAsset: string, buyAsset: string, amountInWei: bigint, poolFee: number, maxSlip: number): Promise<void> {
        const poolAddress = await this.getPoolAddress(sellAsset, buyAsset, 3000)
        const price = await this.getPriceForInvestment(buyAsset, poolAddress)
        const amountOutMinimum = await this.getAmountOutMinimum(sellAsset, amountInWei, price, maxSlip)
        this.logger.info(`\ntaking profits selling ${amountInWei} of ${sellAsset} at ${price} to receive at least: ${amountOutMinimum} ${buyAsset}`)
        try {
            this.logger.info(`\ncalling contract with ${sellAsset} ${amountInWei} ${poolFee} ${maxSlip}`)
            return this.contract.takeProfits(sellAsset, amountInWei, poolFee, maxSlip);
        } catch (error) {
            alert(error.message);
        }
    }

    public async logFundamentals(clientInterestedIn: EDataTypes[], scAddress: string): Promise<void> {

        if (clientInterestedIn.indexOf(EDataTypes.masterData) > -1) {
            this.logger.info("\n\n*************************** Master Data ***************************")
            this.logger.debug(`smartContractAddress: ${scAddress}`)
            this.logger.debug(`totalSupply: ${ethers.formatEther(await this.totalSupply())}`)
            this.logger.debug(`symbol: ${await this.symbol()}`)
            this.logger.debug(`routerAddress: ${await this.routerAddress()}`)
            this.logger.debug(`factoryAddress: ${await this.factoryAddress()}`)
            this.logger.debug(`wethAddress: ${await this.wethAddress()}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.budgetData) > -1) {
            this.logger.info("\n\n*************************** Budget Data ***************************")
            this.logger.debug(`investmentBudget: ${ethers.formatEther(await this.investmentBudget())}`)
            this.logger.debug(`pubGoodsFundingBudget: ${ethers.formatEther(await this.pubGoodsFundingBudget())}`)
            this.logger.debug(`geoCashingBudget: ${ethers.formatEther(await this.geoCashingBudget())}`)
            this.logger.debug(`liquidityBudget: ${ethers.formatEther(await this.liquidityBudget())}`)
            this.logger.debug(`balanceOf Smart Contract: ${ethers.formatEther(await this.balanceOf(scAddress))}`)
            this.logger.debug(`amountOfETHInSmartContract: ${ethers.formatEther(await this.amountOfETHInSmartContract(scAddress))}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.attestations) > -1) {
            this.logger.info("\n\n*************************** Attestations ***************************")
            const aCounter = await this.contract.aCounter()
            this.logger.debug(`attestation counter: ${aCounter}`)
            this.logger.debug(`attestation 0: ${await this.contract.attestations(0)}`)
            this.logger.debug(`attestation 1: ${await this.contract.attestations(1)}`)
            const latestAttestation = await this.contract.attestations(aCounter)
            const splitted = latestAttestation.toString().split(",")
            const result = ethers.decodeBytes32String(splitted[2])
            this.logger.debug(`attestation ${aCounter}: ${result}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.gamingData) > -1) {
            this.logger.info("\n\n*************************** Gaming Data ***************************")
            this.logger.debug(`addressOfHighestSoFarInvestment: ${await this.addressOfHighestSoFarInvestment()}`)
            this.logger.debug(`addressOfHighestSoFarPublicGood: ${await this.addressOfHighestSoFarPublicGood()}`)
            this.logger.debug(`addressOfHighestSoFarGeoCash: ${await this.addressOfHighestSoFarGeoCash()}`)
            this.logger.debug(`investmentCandidatesAt1: ${await this.investmentCandidatesAt(1)}`)
            this.logger.debug(`investmentCandidatesAt2: ${await this.investmentCandidatesAt(2)}`)
            this.logger.debug(`pubGoodCandidatesAt1: ${await this.pubGoodCandidatesAt(1)}`)
            this.logger.debug(`pubGoodCandidatesAt2: ${await this.pubGoodCandidatesAt(2)}`)
            this.logger.debug(`geoCashingCandidatesAt1: ${await this.geoCashingCandidatesAt(1)}`)
            this.logger.debug(`geoCashingCandidatesAt2: ${await this.geoCashingCandidatesAt(2)}`)
        }

        if (clientInterestedIn.indexOf(EDataTypes.operationalData) > -1) {
            this.logger.info("\n\n*************************** Operational Data ***************************")
            this.logger.debug(`iCCounter: ${await this.iCCounter()}`)
            this.logger.debug(`pGCCounter: ${await this.pGCCounter()}`)
            this.logger.debug(`gCCCounter: ${await this.gCCCounter()}`)
            this.logger.debug(`iCIDsAtFC: ${await this.iCIDAt(scAddress)}`)
            this.logger.debug(`pGCIDsAtOPDonations: ${await this.pGCIDAt(scAddress)}`)
            this.logger.debug(`gCCIDsAtVitalik: ${await this.gCCIDAt(scAddress)}`)
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
    public async amountOfETHInSmartContract(scAddress: string): Promise<any> {
        return this.provider.getBalance(scAddress)
    }
    public async balanceOf(scAddress: string): Promise<any> {
        return this.contract.balanceOf(scAddress)
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
}
