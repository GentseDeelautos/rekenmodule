const kwPerKm = 15.0 / 100 // TODO: afhankelijk van rijprofiel
const Partago = {
  nonCoop: {
    variables: {
      freeTimeRange: ['0:00', '6:00'],
      start: 30,
      kwPerKm,
      creditsPerKw: 15
    },
    getKeyValues: ({ startTime, timeRange, distanceRange, variables }) => {
      const { start, euroPerCredit, kwPerKm, creditsPerKw } = variables
      return [].concat(timeRange).reduce((acc, time) => [
        ...acc, 
        ...[].concat(distanceRange).reduce((acc, dist) => [
          ...acc,
          [
            time + startTime, 
            dist, 
            (start + dist * kwPerKm * creditsPerKw + time / 60 / 1000) * euroPerCredit
          ]
        ],  [])
      ], [])
    }
  }
}


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
  'Partago klein abonnement': {
    variables: {
      ...Partago.nonCoop.variables,
      euroPerCredit: 95.0 / 1800,
    },
    getKeyValues: Partago.nonCoop.getKeyValues
  },
  'Partago groot abonnement': {
    variables: {
      ...Partago.nonCoop.variables,
      euroPerCredit: 150.0 / 3000,
    },
    getKeyValues: Partago.nonCoop.getKeyValues
  },
  'Partago coop': {
    variables: {
      kwPerKm,
      euroPerKw: 1.4
    },
    getKeyValues: ({ startTime, timeRange, distanceRange, variables }) => {
      const { kwPerKm, euroPerKw } = variables
      return [].concat(timeRange).reduce((acc, time) => (
        [...acc, ...[].concat(distanceRange).reduce((acc2, dist) => (
          [...acc2, [time + startTime, dist, Math.round(100 * dist * kwPerKm * euroPerKw) / 100]]
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
      costPerHour: 1.75
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

function calculate ({ name, distance, duration }) {
  const { formula, variables, getKeyValues } = settings[name] || {}
  if (getKeyValues) 
    return getKeyValues({ startTime: Date.now(), timeRange: duration * 60 * 1000, distanceRange: distance, variables})[0][2]
  return math.evaluate(formula, { ...variables, distance, duration })
}

function calculateRounded (opties) {
  return Math.round(calculate(opties) * 100) / 100
}
