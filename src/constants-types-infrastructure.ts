import { ethers } from "../deps.ts"

export const FC = "0x271E3e424c1226f461b2d97DFc8685DCCbbd7135"
export const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
export const CULT = "0xf0f9D895aCa5c8678f706FB8216fa22957685A13"
export const POD = "0xE90CE7764d8401d19ed3733a211bd3b06c631Bc0"
export const SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
export const OPDonations = "0x2D1bEB3e41D90d7F9756e92c3061265206a661A2"
export const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
export const MrO = "0x5FDF0f97954cc22d23268D930e69DC7F53018261"
export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"


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

export async function getContract(asset: string, provider: any): Promise<any> {
    const abi = JSON.parse(Deno.readTextFileSync('./freedomcash-abi.json'))
    return new ethers.Contract(asset, abi, await provider.getSigner())
}