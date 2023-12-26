import { InvestorServiceBBBased } from "./src/investor-service.ts"

const investorServiceBBBased: InvestorServiceBBBased = new InvestorServiceBBBased(27)
const minHistoryLength = 3
investorServiceBBBased.addToPriceHistory(6)
investorServiceBBBased.addToPriceHistory(9)
investorServiceBBBased.addToPriceHistory(3)
const investmentDecision = investorServiceBBBased.getInvestmentDecision(minHistoryLength)
console.log(investmentDecision)