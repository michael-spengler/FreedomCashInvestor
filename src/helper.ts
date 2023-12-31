import { ethers, Logger } from '../deps.ts';
import { FC } from './monique-baumann.ts';

export class Helper {

    public static instance: Helper
    public static logger: Logger

    public static async getInstance(): Promise<Helper> {
        if (Helper.instance == undefined) {
            const providerURL = await Helper.getProviderURL(Helper.logger)
            Helper.instance = new Helper(providerURL)
            await Helper.instance.initializeContract()
        }
        return Helper.instance
    }

    public static async getLogger(): Promise<Logger> {
        if (Helper.logger === undefined) {
            const minLevelForConsole = 'DEBUG'
            const minLevelForFile = 'WARNING'
            const fileName = "./warnings-errors.txt"
            const pureInfo = true // leaving out e.g. the time info
            Helper.logger = Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
        } 
        return Helper.logger
    }

    public static getProviderURL(logger: Logger): string {
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
        throw new Error("could not get a providerURL")
    }

    private provider: any
    private contract: any = undefined
    private testWallet: any

    private constructor(providerURL: string) { // private to ensure singleton pattern and proper initialization
        this.provider = new ethers.JsonRpcProvider(providerURL)
    }

    public async initializeContract() {
        this.contract = new ethers.Contract(FC, this.getFreedomCashABI(), await this.provider.getSigner())
        // const testWallet = new ethers.Wallet(pkTestWallet, this.provider);
        // this.contract = new ethers.Contract(Helper.FC, this.getFreedomCashABI(), testWallet);

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
    public async getAssetContract(asset: string): Promise<any> {
        return new ethers.Contract(asset, this.getFreedomCashABI(), await this.provider.getSigner())
    }
}

