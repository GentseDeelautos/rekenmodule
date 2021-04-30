import { createModel } from '../../src/models/costCalculation.1.mjs'

export const createTest = (luxon, math, getPageText) => {
  const { settings } = createModel(luxon, math)

  describe('Formulas', () => {
    xdescribe('Partago', () => {
      let frag
      let ritPrijzen
      beforeAll(async () => {
        frag = await getPageText('https://www.partago.be/tarieven.html')
        const [_, ...rest] = frag.textContent.split('Ritprijs')
        ritPrijzen = rest
      })
      describe('abonnement en bundel', () => {
        let text
        beforeAll(() => {
          text = frag.textContent
            .split('Stap 2 Koop jouw bundel of activeer een abonnement')[1]
            .split('Stap 3 Om het leven gemakkelijker te maken')[0]
        })
        describe('kleine bundel', () => {
          const { freeTimeRange, startCostCredits, creditsPerKwh, euroPerCredit } =
            settings['Partago kleine bundel'].variables
          const planIndex = 0
          it('matches opstartcredits', () =>
            expect(text).toContain(` ${startCostCredits} credits bij reserveren`))
          it('matches credits per kWh', () =>
            expect(text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
          it('still has the same free time range as of 01/01/2021', () =>
            expect(ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
          it('still has price as of 01/01/2021', async () => {
            expect(ritPrijzen[planIndex])
              .toContain(`${(Math.round(euroPerCredit*100*60) /100 ).toLocaleString('nl-BE')} € per uur`)
          })
          it('considers DST changes', () =>{
            const beforeDST = luxon.DateTime.fromISO('2021-03-28T00:00:00', { zone: 'Europe/Brussels'})
            expect(beforeDST.plus({ hours: freeTimeRange[1].split(':')[0] }).hour).toEqual(7)
          })
        })
        describe('grote bundel', () => {
          const { freeTimeRange, startCostCredits, creditsPerKwh, euroPerCredit } =
            settings['Partago grote bundel'].variables
          const planIndex = 1
          it('matches opstartcredits', () =>
            expect(text).toContain(` ${startCostCredits} credits bij reserveren`))
          it('matches credits per kWh', () =>
            expect(text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
          it('still has price as of 01/01/2010', async () => {
              expect(ritPrijzen[planIndex])
                .toContain(`${(euroPerCredit * 60).toLocaleString('nl-BE')} € per uur`)
          })
          it('still has the same free time range as of 01/01/2021', () =>
            expect(ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
        })
        describe('klein abonnement', () => {
          const { freeTimeRange, startCostCredits, creditsPerKwh, euroPerCredit } =
            settings['Partago klein abonnement'].variables
          const planIndex = 2
          it('matches opstartcredits', () =>
            expect(text).toContain(` ${startCostCredits} credits bij reserveren`))
          it('matches credits per kWh', () =>
            expect(text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
          it('still has price as of 01/01/2010', async () => {
            expect(ritPrijzen[planIndex])
              .toContain(`${(Math.round(euroPerCredit*100*60) /100 ).toLocaleString('nl-BE')} € per uur`)
          })
          it('still has the same free time range as of 01/01/2021', () =>
          expect(ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
        })
        describe('groot abonnement', () => {
          const { freeTimeRange, startCostCredits, creditsPerKwh, euroPerCredit } =
            settings['Partago groot abonnement'].variables
          const planIndex = 3
          it('matches opstartcredits', () =>
            expect(text).toContain(` ${startCostCredits} credits bij reserveren`))
          it('matches credits per kWh', () =>
            expect(text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
          it('still has price as of 01/01/2010', async () => {
            expect(ritPrijzen[planIndex])
              .toContain(`${(Math.round(euroPerCredit * 60) ).toLocaleString('nl-BE')},00 € per uur`)
          })
          it('still has the same free time range as of 01/01/2021', () =>
          expect(ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
        })
      })
      describe('coop formule', () => {
        const { euroPerKw } = settings['Partago coop'].variables
        const planIndex = 4
        it('still has price of 01/01/2021', () => {
          const text = frag.textContent
            .split('Ook last van tijdstress?')[1]
            .split('Heb je credits nog beschikbaar op je Partago rekening')[0]
          expect(text).toContain(`${euroPerKw/*.toLocaleString('nl-BE')*/} euro per kWh.`)
        })
      })
    })
    describe('GreenMobility', () => {
      let frag
      beforeAll(async () =>
        frag = await getPageText('https://www.greenmobility.com/be/nl/prijzen/'))
      describe('prePaid', () => {
        let textBlocks
        let text
        beforeAll(() => {
          text = frag.textContent
              .split('Prepaid minuten')[1]
              .split('Uur-en dagpakketten')[0]
          textBlocks = text.split('Kies in de app')
        })
        const expectCorrectFormulaValuesFor = (index, name) => {
          const { price, timeMin } = settings[`GreenMobility prepaid ${name}`].variables
          expect(textBlocks[index]).toMatch(new RegExp(`${price} Euro\\s*${timeMin}min`))
        }
        describe('25 euro', () => 
          it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(0, '25 euro')))
        describe('50 euro', () => 
          it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(1, '50 euro')))
        describe('150 euro', () => 
          it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(2, '150 euro')))
      })
      describe('uur- en dagpakketten', () => {
        let textBlocks
        let text
        beforeAll(() => {
          text = frag.textContent.split('Uur-en dagpakketten')[1]
          textBlocks = text.split('Kies in de app')})
        const { variables: { overDistancePerKm, overTimeCost } } = settings['GreenMobility 3 uur pakket']
        describe('over distance', () =>
          it('still costs the same as of 01/01/2021', 
            () => expect(text).toContain(`Als je meer rijdt dan de kilometers in jouw pakket, zal elke kilometer daarna € ${overDistancePerKm.toLocaleString('nl-BE')}/km kosten`)))
        describe('over time', () =>
          it('still costs the same as of 01/01/2021', 
            () => expect(text).toContain(`Anders rijd je verder aan € ${overTimeCost.toLocaleString('nl-BE')}/minuut.`)))
        const expectCorrectValuesFor = (index, values, unitNl) => {
          const [[unitEn, value]] = Object.entries(values)
          const { variables: { price, maxDistance, maxTime } } = settings[`GreenMobility ${value} ${unitNl} pakket`]
          const duration = luxon.Duration.fromObject({ minutes: maxTime, locale: 'nl-BE' })
          const period = `${duration.as(unitEn)}${unitNl}`
          expect(textBlocks[index]).toMatch(new RegExp(`${price} Euro\\s*${period}[\\s\\S]*incl. ${maxDistance} km`))
        }  
        describe('3 uur', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(0, { hours: 3 },'uur')))
        describe('5 uur', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(1, { hours: 5 }, 'uur')))
        describe('10 uur', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(2, { hours: 10}, 'uur')))
        describe('1 dag', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(3, { days: 1 }, 'dag')))
        describe('2 dagen', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(4, { days: 2 }, 'dagen')))
        describe('3 dagen', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(5, { days: 3 }, 'dagen')))
        describe('7 dagen', () => it('still means the same as of 01/01/2021', () => expectCorrectValuesFor(6, { days: 7 }, 'dagen')))
      })
    })
    describe('Degage', () => {
      let frag
      const { to100, to200, more } = settings['D&eacute;gage'].variables

      beforeAll(async () => {
        frag = await getPageText('https://www.degage.be/de-prijzen/')
      })
      describe('beneden 100 km', () =>
        it('still has price of 01/01/2021', () =>
          expect(frag.textContent).toContain(`0-100 km€ ${to100.toLocaleString('nl-BE')}`)))
      describe('tussen 100 en 200 km', () =>
        it('still has price of 01/01/2021', () =>
          expect(frag.textContent).toContain(`100-200 km€ ${to200.toLocaleString('nl-BE')}`)))
      describe('boven 1200 km', () =>
        it('still has price of 01/01/2021', () =>
          expect(frag.textContent).toContain(`vanaf 201 km€ ${more.toLocaleString('nl-BE')}`)))
    })
    describe('Cambio', () =>  {
      const parts = {}
      beforeAll(async () => {
        const text = (await getPageText('https://www.cambio.be/nl-vla/hoeveel-kost-het'))
          .textContent
        const [comfortAndMore] = text.split('FINANCIERINGSBIJDRAGE')
        const [bonusAndMore, comfort] = text.split('COMFORT')
        const [startAndMore, bonus] = text.split('BONUS')
        const start = text.split('START').pop()
        Object.assign(parts, { start, bonus, comfort })
      })
      describe('Start', () => {
        const {variables: { to100, more, costPerHour } } =
          settings['Cambio Start']
        // TODO: isoleer wagentypes 
        describe('uurprijs', () => 
          it('is nog steeds hetzelfde als 01/01/2021', () =>
            expect(parts.start).toMatch(new RegExp(
              `Uurprijs\\s\\(van 7u - 23u\\)\\n\\s*€\\s${costPerHour}\\s\\n`
            ))))
        describe('kilometerprijs', () => {
          describe('minder dan 100 km', () => 
            it('is nog steeds hetzelfde als 01/01/2021', () =>
              expect(parts.start).toMatch(new RegExp(
                `Kilometerprijs\\s\\<\\s100km\\n\\s*€\\s${to100 /*.toLocaleString('nl-BE')*/}\\s\\n`))))
          describe('meer dan 100 km', () => 
            it('is nog steeds hetzelfde als 01/01/2021', () =>
              expect(parts.start).toMatch(new RegExp(
                `Kilometerprijs\\s\\>\\s100km\\n\\s*€\\s${more.toLocaleString('nl-BE')}\\n`))))
        })
      })
    })
  })
}
