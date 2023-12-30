# Freedom Cash Investor

This [deno module](https://deno.land/x/freedom_cash_investor) stabilizes the buy price and increases the sell price for [Freedom Cash](https://github.com/monique-baumann/FreedomCash) while volatility farming via [Bollinger Bands](https://www.youtube.com/watch?v=-6cbdJulb7s) and maybe even while [sleeping](https://deno.land/x/sleep).  

## Usage Example

The coolest usage example you might find via https://FreedomCash.org.  

```ts
import { Investor } from "https://deno.land/x/freedom_cash_investor/mod.ts"
import { Logger } from 'https://deno.land/x/log@v1.1.1/mod.ts'

const minLevelForConsole = 'DEBUG' 
const minLevelForFile = 'WARNING' 
const fileName = "./warnings-errors.txt"
const pureInfo = true // leaving out e.g. the time info
export const logger = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)

const minHistoryLength = 3
const bFactor = 6
const sleepTimeInSeconds = 27
const relevantHistoryLength = 45
const investor: Investor = await Investor.getInstance(relevantHistoryLength, sleepTimeInSeconds, logger)
await investor.startTheParty(minHistoryLength, bFactor)
```

## Execute Usage Example
```sh
deno run https://deno.land/x/freedom_cash_investor/usage-example.ts
```

## Execute Unit Tests
```sh
deno test --allow-all https://deno.land/x/freedom_cash_investor/src/helpers/blockchain-helper.spec.ts
deno test --allow-all https://deno.land/x/freedom_cash_investor/src/helpers/decision-helper.spec.ts
```
  
## Donations
Thanks to [Freedom Cash](https://FreedomCash.org), we are already free.  
If you want to donate, you might consider donating to the [otherparty.co.uk](https://www.otherparty.co.uk/donate-crypto-the-other-party) to ensure people do not need to donate to victims but rather donate successfully to problem solvers.   
  
![direct-democracy](https://github.com/michael-spengler/sleep/assets/145258627/fe97b7da-62b4-4cf6-9be0-7b03b2f3095a)

## ToDos

Test e.g. for POD as public good  
