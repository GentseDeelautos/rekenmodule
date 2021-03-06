export const createModel = (luxon, math) => {
  const { DateTime, Interval, Duration } = luxon

  const zone = 'Europe/Brussels'

  const getNextIntervalEndMs = ({ startMs, endMs, freeRange }) => {
    const freeRangeDateTimes = freeRange
    .map(obj => DateTime.fromMillis(startMs, { zone }).set(obj))
    const freeRangeMs = 
      [...freeRangeDateTimes, ...freeRangeDateTimes.map(t => t.plus({ days: 1 }))]
        .map(dateTime => dateTime.valueOf())
    const sorted = [...new Set([startMs, endMs, ...freeRangeMs].sort())]
    const startIndex = sorted.indexOf(startMs)
    return sorted[startIndex + 1]
  }

  const Partago = (() => {
    const calculateTimeCredits = ({ startTime, duration, freeTimeRange }) => {
      const startMs = startTime.valueOf()
      const endMs = startTime.plus(duration).valueOf()
      
      const freeRangeMs = freeTimeRange.map(obj => startTime.set(obj).valueOf())
      const isReverseRange = freeRangeMs[0] > freeRangeMs[1]

      // not reversed: 
      // 6:00 x 0:00 => x in interval
      // 6:00 x => x = startTime => x in interval
      // x 0:00 => x = endTime => x not interval
      // reverse range:
      // 23:00 x 6:00 => x not in interval
      // 23:00 x => x = endTime =>  not in interval
      // x 6:00 => x= startTime => in interval

      const sorted = [...new Set([...freeRangeMs, startMs].sort().reverse())]

      let costMs = 0
      let startsInFreeInterval = (sorted[1] === startMs) !== isReverseRange

      
      let tmpMs = startMs
      while (tmpMs < endMs) {
        const tmpEndMs = getNextIntervalEndMs({ startMs: tmpMs, endMs, freeRange: freeTimeRange } )
        if (!startsInFreeInterval) costMs += (tmpEndMs - tmpMs)
        startsInFreeInterval = !startsInFreeInterval
        tmpMs = tmpEndMs
      }  

      return costMs / (60 * 1000)
    }

    const calculateDistanceCredits = ({ distance, kWhPerKm, creditsPerKwh }) =>
      distance * kWhPerKm * creditsPerKwh

    

    const getKeyValues = ({ startTime, timeRangeMs, distanceRange, variables }) => {
      const { startCostCredits, euroPerCredit, kWhPerKm, creditsPerKwh, freeTimeRange } = variables
      // TODO: this should only be happening once
      const freeTimeRangeObjects = freeTimeRange.map(token => {
        const [hour, minute] = token.split(':')
        return { hour, minute, second: 0, millisecond: 0 }
      })

      return [].concat(timeRangeMs).reduce((acc, milliSeconds) => [
        ...acc, 
        ...[].concat(distanceRange).reduce((acc, distance) => [
          ...acc,
          [
            milliSeconds + startTime.valueOf(), 
            distance, 
            euroPerCredit * (startCostCredits +
              calculateDistanceCredits({ distance, kWhPerKm, creditsPerKwh }) +
              calculateTimeCredits({ 
                startTime,
                duration: Duration.fromObject({ milliSeconds }),
                freeTimeRange: freeTimeRangeObjects 
              })
            )
          ]
        ],  [])
      ], [])
    }

    return {
      nonCoop: {
        variables: {
          freeTimeRange: ['0:00', '6:00'],
          startCostCredits: 30,
          creditsPerKwh: 15
        },
        getKeyValues
      }
    }
  })()

  const CambioFormula = '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'

  const GreenMobilityPrepaidFormula = 'duration * price / timeMin'
  const GreenMobilityPakketFormula = 
    '(distance > maxDistance ? (distance - maxDistance) * overDistancePerKm: 0 ) + \
    (duration > maxTime ? (duration - maxTime) * overTimeCost : 0) + \
    price'

  const GreenMobilityExcessionCost = {
    overDistancePerKm: 0.25,
    overTimeCost: 0.25
  }

  const settings = {
    'Partago grote bundel': {
      variables: {
        ...Partago.nonCoop.variables,
        euroPerCredit: 300.0 / 4800,
      },
      getKeyValues: Partago.nonCoop.getKeyValues
    },
    'Partago kleine bundel': {
      variables: {
        ...Partago.nonCoop.variables,
        euroPerCredit: 75.0 / 1000,
      },
      getKeyValues: Partago.nonCoop.getKeyValues
    },

    'Partago coop': {
      variables: {
        euroPerKw: 1.4
      },
      getKeyValues: ({ startTime, timeRangeMs, distanceRange, variables }) => {
        const { kWhPerKm, euroPerKw } = variables
        return [].concat(timeRangeMs).reduce((acc, until) => (
          [...acc, ...[].concat(distanceRange).reduce((acc2, distance) => (
            [...acc2, [until + startTime.valueOf(), distance, Math.round(100 * distance * kWhPerKm * euroPerKw) / 100]]
          ), [])]
        ), [])
      }
    },
    'D&eacute;gage': {
      variables: {
        to100: 0.32,  // prijs per distance tem 100km
        to200: 0.28, // prijs per distance van 101 tem 200km
        more: 0.24 // prijs per distance vanaf 201km
      },
      formula: 'distance <= 100 ? to100 * distance : to100 * 100 + (distance <= 200 ? to200 * (distance - 100) : (to200 * 100 + more * (distance - 200)))'
    },
    'Cambio Start': {
      variables: {
        to100: 0.35,  // prijs per distance tem 100km
        more: 0.23, // prijs per distance vanaf 100km
        costPerHour: 2
      },
      formula: CambioFormula
    },
    'Cambio Bonus': {
      variables: {
        to100: 0.26,  // prijs per distance tem 100km
        more: 0.23, // prijs per distance vanaf 100km
        costPerHour: 1.75
      },
      formula: CambioFormula
    },
    'Cambio Comfort': {
      variables: {
        to100: 0.23,  // prijs per distance tem 100km
        more: 0.18, // prijs per distance vanaf 100km
        costPerHour: 1.55
      },
      formula: CambioFormula
    },
    BattFan: {
      variables: {
        costPerDay: 30.25
      },
      formula: 'costPerDay + costPerDay * (duration - duration % (60 * 24)) / (60 * 24)'
    },
    'GreenMobility prepaid 25 euro': {
      variables: {
        price: 25,
        timeMin: 75
      },
      formula: GreenMobilityPrepaidFormula
    },
    'GreenMobility prepaid 50 euro': {
      variables: {
        price: 50,
        timeMin: 175
      },
      formula: GreenMobilityPrepaidFormula
    },
    'GreenMobility prepaid 150 euro': {
      variables: {
        price: 150,
        timeMin: 600
      },
      formula: GreenMobilityPrepaidFormula
    },
    'GreenMobility 3 uur pakket': {
      variables: {
        ...GreenMobilityExcessionCost,
        price: 35,
        maxTime: 3 * 60,
        maxDistance: 100
      },
      formula: GreenMobilityPakketFormula
    },
    'GreenMobility 5 uur pakket': { variables: { ...GreenMobilityExcessionCost, price: 45, maxTime: 5 * 60, maxDistance: 150 }, formula: GreenMobilityPakketFormula },
    'GreenMobility 10 uur pakket': { variables: { ...GreenMobilityExcessionCost, price: 60, maxTime: 10 * 60, maxDistance: 150} , formula: GreenMobilityPakketFormula },
    'GreenMobility 1 dag pakket': { variables: { ...GreenMobilityExcessionCost, price: 75, maxTime: 1 * 24 * 60, maxDistance: 200} , formula: GreenMobilityPakketFormula },
    'GreenMobility 2 dagen pakket': { variables: { ...GreenMobilityExcessionCost, price: 125, maxTime: 2 * 24 * 60, maxDistance: 400 }, formula: GreenMobilityPakketFormula },
    'GreenMobility 3 dagen pakket': { variables: { ...GreenMobilityExcessionCost, price: 175, maxTime: 3 * 24 * 60, maxDistance: 600 }, formula: GreenMobilityPakketFormula },
    'GreenMobility 7 dagen pakket': { variables: { ...GreenMobilityExcessionCost, price: 350, maxTime: 7 * 24 * 60 , maxDistance: 1000 }, formula: GreenMobilityPakketFormula },
  }

  function calculate ({ name, distance, duration, kWhPerKm, startTime }) {
    const { formula, variables, getKeyValues } = settings[name] || {}
    if (getKeyValues) 
      return getKeyValues({ startTime, timeRangeMs: duration * 60 * 1000, distanceRange: distance, variables: { ...variables, kWhPerKm } })[0][2]
    return math.evaluate(formula, { ...variables, kWhPerKm, distance, duration })
  }

  function calculateRounded (options) {
    return Math.round(calculate(options) * 100) / 100
  }

  return { settings, calculate, calculateRounded }
}
