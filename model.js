const settings = {
  Partago: {
    color: 'lime',
    variables: {
      start: 30,
      kwPerKm: 15.0 / 100, // TODO: afhankelijk van rijprofiel
      creditsPerKw: 15,
      euroPerCredit: 300.0 / 4800, // TODO: afhankelijk van laden
    },
    // TODO: time correctie is dagelijks...
    formula: '(start + distance * kwPerKm * creditsPerKw + ((duration > 18 * 60) ? 18 * 60 : duration)) * euroPerCredit'
  },
  'D&eacute;gage': {
    color: 'blue',
    variables: {
      to100: 0.32,  // prijs per distance tem 100km
      to200: 0.28, // prijs per distance van 101 tem 200km
      more: 0.24 // prijs per distance vanaf 201km
    },
    formula: 'distance <= 100 ? to100 * distance : to100 * 100 + (distance <= 200 ? to200 * (distance - 100) : (to200 * 100 + more * (distance - 200)))'
  },
  'Cambio Start': {
    color: 'pink',
    variables: {
      to100: 0.35,  // prijs per distance tem 100km
      more: 0.23, // prijs per distance vanaf 100km
      costPerHour: 1.75
    },
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
  },
  'Cambio Bonus': {
    color: 'orange',
    variables: {
      to100: 0.26,  // prijs per distance tem 100km
      more: 0.23, // prijs per distance vanaf 100km
      costPerHour: 1.75
    },
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
  },
  'Cambio Comfort': {
    color: 'red',
    variables: {
      to100: 0.23,  // prijs per distance tem 100km
      more: 0.18, // prijs per distance vanaf 100km
      costPerHour: 1.55
    },
    formula: '(costPerHour * ((duration - duration % 60) / 60 + 1)) + (distance <= 100 ? to100 * distance : (to100 * 100 + more * (distance - 100)))'
  },
  BattFan: {
    color: 'purple',
    variables: {
      costPerDay: 30.25
    },
    formula: 'costPerDay + costPerDay * (duration - duration % (60 * 24)) / (60 * 24)'
  }
}

function calculate ({ name, distance, duration }) {
  const { formula, variables } = settings[name] || {}
  return math.evaluate(formula, { ...variables, distance, duration })
}

function calculateRounded (opties) {
  return Math.round(calculate(opties) * 100) / 100
}
