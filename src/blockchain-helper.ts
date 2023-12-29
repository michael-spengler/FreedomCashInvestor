import { ethers } from 'npm:ethers@6.9.1';
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'

export class BlockchainHelper {

    public static readonly ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    public static readonly CULT = "0xf0f9D895aCa5c8678f706FB8216fa22957685A13"
    public static readonly POD = "0xE90CE7764d8401d19ed3733a211bd3b06c631Bc0"
    public static readonly SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
    public static readonly FC = "0xAB8191bA85d9b8C69921FA7EaDB657Da5f30a645"
    public static readonly OPDonations = "0x2D1bEB3e41D90d7F9756e92c3061265206a661A2"
    public static readonly WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    public static readonly UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
    public static readonly VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

    public static instance: BlockchainHelper

    public static async getInstance(providerURL: string): Promise<BlockchainHelper> {
        if (BlockchainHelper.instance == undefined) {
            BlockchainHelper.instance = new BlockchainHelper(providerURL)
            await BlockchainHelper.instance.initializeContract()
        }
        return BlockchainHelper.instance
    }

    public static convertToWei(amount: number): BigInt {
        return ethers.parseEther(amount.toString())
    }

    public static async getLogger(): Promise<Logger> {
        const minLevelForConsole = 'DEBUG'
        const minLevelForFile = 'WARNING'
        const fileName = "./warnings-errors.txt"
        const pureInfo = true // leaving out e.g. the time info
        return Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
    }

    public static getProviderURL(logger: Logger): string | void {
        let configuration: any = {}
        if (Deno.args[0] !== undefined) { // supplying your provider URL via parameter
            return Deno.args[0]
        } else { // ... or via .env.json
            try {
                configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
                return configuration.providerURL
            } catch (error) {
                logger.error(error.message)
                logger.error("without a providerURL I cannot connect to the blockchain")
            }
        }
    }    

    private provider: any
    private contract: any = undefined
    private testWallet: any

    private constructor(providerURL: string) { // private to ensure singleton pattern and proper initialization
        this.provider = new ethers.JsonRpcProvider(providerURL)
    } 

    public async initializeContract(){
        this.contract = new ethers.Contract(BlockchainHelper.FC, this.getFreedomCashABI(), await this.provider.getSigner())
        // const testWallet = new ethers.Wallet(pkTestWallet, this.provider);
        // this.contract = new ethers.Contract(BlockchainHelper.FC, this.getFreedomCashABI(), testWallet);

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
