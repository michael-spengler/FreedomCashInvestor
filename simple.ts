import {ethers} from "./deps.ts"

import { getProvider, FC, getABI, getLogger } from "./src/constants-types-infrastructure.ts"

const logger  = await getLogger()
const configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
const provider = getProvider(logger)
const wallet = new ethers.Wallet(configuration.pkTestWallet, provider)
const signer = await wallet.connect(provider)
console.log(await signer.getAddress())
const contract = new ethers.Contract(FC, getABI(), signer)
// const contract = new ethers.Contract(FC, getABI(), await provider.getSigner())
// return new ethers.Contract(asset, abi, wallet)
//    return new ethers.Contract(asset, abi, await provider.getSigner())

const amountInWei = ethers.parseEther("1")
const bPrice = await contract.getBuyPrice(amountInWei);
const bcost = BigInt(1) * bPrice;

const transaction = await contract.voteForInvestmentIn(FC, bPrice, amountInWei, { value: bcost })
await transaction.wait()
const balance = await contract.balanceOf(wallet.address)
console.log(wallet.address, balance)