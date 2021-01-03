const settings = {
  'Partago grote bundel': {
    variables: {
      start: 30,
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      creditsPerKw: 15,
      euroPerCredit: 300.0 / 4800,
    },
    // TODO: time correctie is dagelijks...
    formula: '(start + distance * kwPerKm * creditsPerKw + ((duration > 18 * 60) ? 18 * 60 : duration)) * euroPerCredit'
  },
  'Partago kleine bundel': {
    variables: {
      start: 30,
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      creditsPerKw: 15,
      euroPerCredit: 75.0 / 1000,
    },
    // TODO: time correctie is dagelijks...
    formula: '(start + distance * kwPerKm * creditsPerKw + ((duration > 18 * 60) ? 18 * 60 : duration)) * euroPerCredit'
  },
  'Partago klein abonnement': {
    variables: {
      start: 30,
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      creditsPerKw: 15,
      euroPerCredit: 95.0 / 1800,
    },
    // TODO: time correctie is dagelijks...
    formula: '(start + distance * kwPerKm * creditsPerKw + ((duration > 18 * 60) ? 18 * 60 : duration)) * euroPerCredit'
  },
  'Partago groot abonnement': {
    variables: {
      start: 30,
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      creditsPerKw: 15,
      euroPerCredit: 150.0 / 3000,
    },
    // TODO: time correctie is dagelijks...
    formula: '(start + distance * kwPerKm * creditsPerKw + ((duration > 18 * 60) ? 18 * 60 : duration)) * euroPerCredit'
  },
  'Partago coop': {
    variables: {
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      euroPerKw: 1.4
    },
    // TODO: time correctie is dagelijks...
    formula: 'distance * kwPerKm * euroPerKw'
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
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
  },
  'Cambio Bonus': {
    variables: {
      to100: 0.26,  // prijs per distance tem 100km
      more: 0.23, // prijs per distance vanaf 100km
      costPerHour: 1.75
    },
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
  },
  'Cambio Comfort': {
    variables: {
      to100: 0.23,  // prijs per distance tem 100km
      more: 0.18, // prijs per distance vanaf 100km
      costPerHour: 1.55
    },
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
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
    formula: 'duration * price / timeMin'
  },
  'GreenMobility prepaid 50 euro': {
    variables: {
      price: 50,
      timeMin: 175
    },
    formula: 'duration * price / timeMin'
  },
  'GreenMobility prepaid 150 euro': {
    variables: {
      price: 150,
      timeMin: 600
    },
    formula: 'duration * price / timeMin'
  },
  // 'GreenMobility 3 uur pakket': {
  //   variables: {
  //     overDistancePerKm: 0.25,
  //     price: 35,
  //     time: 3 * 60,
  //     maxDistance: 100
  //   },
  //   formula: 'duration * price / timeMin'
  // },
}

function calculate ({ name, distance, duration }) {
  const { formula, variables } = settings[name] || {}
  return math.evaluate(formula, { ...variables, distance, duration })
}

function calculateRounded (opties) {
  return Math.round(calculate(opties) * 100) / 100
}
