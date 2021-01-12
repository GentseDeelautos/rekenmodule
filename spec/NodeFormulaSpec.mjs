import luxon from 'luxon'
import { createTest } from './FormulaSpec.mjs'
import { evaluate } from 'mathjs'

createTest(luxon, { evaluate })
