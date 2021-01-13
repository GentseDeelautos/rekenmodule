import luxon from 'luxon'
import { createTest } from './helpers/FormulaSuite.mjs'
import * as math from 'mathjs'
import fetch from 'node-fetch'
import JsDom from 'jsdom'

const getPageText = async (href) => {
  const result = await fetch(href)
  const rawText = await result.text()
  const dom = new JsDom.JSDOM(rawText)
  return dom.window.document.querySelector('html')
}

createTest(luxon, math, getPageText)
