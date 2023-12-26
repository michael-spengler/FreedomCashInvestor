# Freedom Cash Investor

This module is utilized e.g. to stabilize the buy price and to increase the sell price for [Freedom Cash](https://github.com/monique-baumann/FreedomCash).  
It utilizes [Bollinger Bands](https://www.youtube.com/watch?v=-6cbdJulb7s) and [sleep](https://deno.land/x/sleep). 

## Usage Example
```ts

import { InvestorServiceBBBased } from "https://deno.land/x/freedom_cash_investor/src/investor-service.ts"

const investorServiceBBBased: InvestorServiceBBBased = new InvestorServiceBBBased(27)
const minHistoryLength = 3

investorServiceBBBased.addToPriceHistory(6)
investorServiceBBBased.addToPriceHistory(9)
investorServiceBBBased.addToPriceHistory(3)
const investmentDecision = investorServiceBBBased.getInvestmentDecision(minHistoryLength)

console.log(investmentDecision)

```

## Execute Usage Example
```sh
deno run https://deno.land/x/freedom_cash_investor/usage-example.ts
```

## Execute Demo
```sh
deno run https://deno.land/x/freedom_cash_investor/demo.ts
```

## Execute Unit Tests
```sh
deno test https://deno.land/x/freedom_cash_investor/src/investor-service.spec.ts
```

---
  
 For further examples you can check the [unit tests](https://deno.land/x/freedom_cash_investor/src/investor-service.spec.ts).
  
## Donations
Thanks to [Freedom Cash](https://FreedomCash.org), we are already free.  
If you want to donate, you might consider donating to the [otherparty.co.uk](https://www.otherparty.co.uk/donate-crypto-the-other-party) to ensure people do not need to donate to victims but rather donate successfully to problem solvers.   
  
![direct-democracy](https://github.com/michael-spengler/sleep/assets/145258627/fe97b7da-62b4-4cf6-9be0-7b03b2f3095a)