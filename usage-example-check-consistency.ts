import { Checker } from "./src/checker.ts"

const checker = await Checker.getInstance()
await checker.checkConsistency()