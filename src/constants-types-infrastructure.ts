import { ethers, Logger } from "../deps.ts"

export const FC = "0x23363Be2f95b397854dd77F6a79CD27Fa46B7e75"
export const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
export const CULT = "0xf0f9D895aCa5c8678f706FB8216fa22957685A13"
export const POD = "0xE90CE7764d8401d19ed3733a211bd3b06c631Bc0"
export const SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
export const OPDonations = "0x2D1bEB3e41D90d7F9756e92c3061265206a661A2"
export const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
export const MrO = "0x5FDF0f97954cc22d23268D930e69DC7F53018261"
export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
export const CENTRALIZEDFRAUD = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

export enum EMode {
    actionRandom,
    actionSpecific,
    bollingerReal,
    bollingerDemo
}

export enum EActions {
    voteForInvestment,
    voteForPublicGood,
    voteForGeoCash,
    executeCommunityInvestment,
    takeProfits,
    sellFreedomCash
}

export enum EDataTypes {
    masterData,
    gamingData,
    pricingData,
    budgetData,
    operationalData,
    attestations
}

export interface IActionsCounters {
    action: EActions,
    count: number
}

let loggerInstance: Logger
export async function getLogger() {
    if (loggerInstance === undefined) {
        const minLevelForConsole = 'DEBUG'
        const minLevelForFile = 'WARNING'
        const fileName = "./warnings-errors.txt"
        const pureInfo = true // leaving out e.g. the time info
        loggerInstance = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
    }
    return loggerInstance
}

export function getProvider(logger: Logger) {
    return new ethers.JsonRpcProvider(getProviderURL(logger))
}
export function getABI() {
    return JSON.parse(Deno.readTextFileSync('./freedomcash-abi.json'))
}
export async function getContract(asset: string, provider: any): Promise<any> {
    const abi = getABI()
    const configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
    // const wallet = new ethers.Wallet(configuration.pkTestWallet, provider)
    // return new ethers.Contract(asset, abi, wallet)
       return new ethers.Contract(asset, abi, await provider.getSigner())
}

export function getProviderURL(logger: Logger): string {
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