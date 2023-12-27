import { ethers } from 'npm:ethers';
import { pkTestWallet, providerURL } from "../../.env.ts"

export class BlockchainHelper {

    public static readonly CULT = "0xf0f9D895aCa5c8678f706FB8216fa22957685A13"
    public static readonly POD = "0xE90CE7764d8401d19ed3733a211bd3b06c631Bc0"
    public static readonly SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
    public static readonly FC = "0x8B3B2f68d8451b800f52B053b63d643CBC0219c7"
    public static readonly OPDonations = "0x2D1bEB3e41D90d7F9756e92c3061265206a661A2"
    public static readonly WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    public static readonly UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

    public static instance 

    public static async getInstance(): Promise<BlockchainHelper> {
        if (BlockchainHelper.instance == undefined){
            BlockchainHelper.instance = new BlockchainHelper(providerURL)
            await BlockchainHelper.instance.initializeContract()
        }
        return BlockchainHelper.instance
    }

    private provider: any
    private contract: any = undefined
    private testWallet: any

    private constructor(providerURL: string) { // private to ensure singleton pattern and proper initialization
        this.provider = new ethers.JsonRpcProvider(providerURL)
    } 

    public async initializeContract(){
        this.contract = new ethers.Contract(BlockchainHelper.FC, this.getFreedomCashABI(), await this.provider.getSigner())
    }
    public getFreedomCashABI(): any {
        return JSON.parse(Deno.readTextFileSync('./freedomcash-abi.json'))
    }
    public getProvider(): any {
        return this.provider
    }
    public getContract(): any {
        return this.contract
    }
    public getWallet(): any {
        return this.testWallet
    }
}


// this.testWallet = new ethers.Wallet(pkTestWallet, this.provider);