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
        formule: '(start + km * kwPerKm * creditsPerKw + ((min > 18 * 60) ? 18 * 60 : min)) * euroPerCredit'
    },
    'D&eacute;gage': {
        color: 'blue',
        variables: {
            tot100: 0.32,  // prijs per km tem 100km
            tot200: 0.28, // prijs per km van 101 tem 200km
            meer: 0.24 // prijs per km vanaf 201km
        },
        formule: 'km <= 100 ? tot100 * km : tot100 * 100 + (km <= 200 ? tot200 * (km - 100) : (tot200 * 100 + meer * (km - 200)))'
    },
    'Cambio Start': {
        color: 'pink',
        variables: {
            tot100: 0.35,  // prijs per km tem 100km
            meer: 0.23, // prijs per km vanaf 100km
            uurPrijs: 1.75
        },
        formule: '(uurPrijs * ((min - min % 60) / 60 + 1)) + (km <= 100 ? tot100 * km : (tot100 * 100 + meer * (km - 100)))'
    },
    'Cambio Bonus': {
        color: 'orange',
        variables: {
            tot100: 0.26,  // prijs per km tem 100km
            meer: 0.23, // prijs per km vanaf 100km
            uurPrijs: 1.75
        },
        formule: '(uurPrijs * ((min - min % 60) / 60 + 1)) + (km <= 100 ? tot100 * km : (tot100 * 100 + meer * (km - 100)))'
    },
    'Cambio Comfort': {
        color: 'red',
        variables: {
            tot100: 0.23,  // prijs per km tem 100km
            meer: 0.18, // prijs per km vanaf 100km
            uurPrijs: 1.55
        },
        formule: '(uurPrijs * ((min - min % 60) / 60 + 1)) + (km <= 100 ? tot100 * km : (tot100 * 100 + meer * (km - 100)))'
    },
    BattFan: {
        color: 'purple',
        variables: {
            dagPrijs: 30.25
        },
        formule: 'dagPrijs + dagPrijs * (min - min % (60 * 24)) / (60 * 24)'
    }
}


function bereken (name, km, min) {
    const { formule, variables } = settings[name]
    return math.evaluate(formule, { ...variables, km, min })
}
function berekenAfgerond (name, km, min) {
    const { formule, variables } = settings[name]
    return Math.round(bereken(name, km, min) * 100) / 100
}
