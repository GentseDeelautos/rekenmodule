const expectImageToBeLoaded = (frag, url) => {
  const img = this.frag.querySelector(`img[src="${url}"]`)
  expect(img).toBeDefined()
}

const expectImageToMatch = async (refLocator, url) => {
  const refImg = document.querySelector(refLocator)
  const response = await fetch(`https://www.partago.be${url}`)
  const blob = await response.blob()
  const reader = new window.FileReader()
  reader.readAsDataURL(blob)
  await new Promise(resolve => reader.onloadend = resolve)
  expect(reader.result).toEqual(refImg.getAttribute('src'))
}

describe('Formulas', () => {
  describe('Partago', () => {
    beforeAll(async () => {
      const response = await fetch('https://www.partago.be/tarieven.html')
      this.frag = document.createRange().createContextualFragment(await response.text())
      const [_, ...ritPrijzen] = this.frag.textContent.split('Ritprijs')
      Object.assign(this, { ritPrijzen })
    })
    describe('abonnement en bundel', () => {
      beforeAll(() => {
        this.text = this.frag.textContent
          .split('Stap 2 Koop jouw bundel of activeer een abonnement')[1]
          .split('Stap 3 Om het leven gemakkelijker te maken')[0]
      })
      describe('kleine bundel', () => {
        const { freeTimeRange, startCostCredits, creditsPerKwh } = settings['Partago kleine bundel'].variables
        const planIndex = 0
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${startCostCredits} credits bij reserveren`))
        it('matches credits per kWh', () =>
          expect(this.text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/kb-plain-final-100dpi_8_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoKleineBundel', url)
          const refImg = document.querySelector('#partagoKleineBundel')
        })
        it('still has the same free time range as of 01/01/2021', () =>
          expect(this.ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
        
        // next tests are important because of the calculation algorithm depends on it
        it('has a free range starting from midnight', () => expect(freeTimeRange[0]).toEqual('0:00'))
        it('DST changes happen inside free range', () =>{
          luxon.Settings.defaultZoneName = 'Europe/Brussels'
          const beforeDST = luxon.DateTime.fromISO('2021-03-28T00:00:00')
          expect(beforeDST.plus({ hours: freeTimeRange[1].split(':')[0] }).hour).toEqual(7)
        })
      })
      describe('grote bundel', () => {
        const { freeTimeRange, startCostCredits, creditsPerKwh } = settings['Partago grote bundel'].variables
        const planIndex = 1
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${startCostCredits} credits bij reserveren`))
        it('matches credits per kWh', () =>
          expect(this.text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
        it('still has price as of 01/01/2010', async () => {
          const url = '/uploads/7/3/7/4/73741293/gb-simpel_2_orig.png'
          expectImageToBeLoaded(this.frag, url)
          await expectImageToMatch('#partagoGroteBundel', url)
        })
        it('still has the same free time range as of 01/01/2021', () =>
          expect(this.ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
      })
      describe('klein abonnement', () => {
        const { freeTimeRange, startCostCredits, creditsPerKwh } = settings['Partago klein abonnement'].variables
        const planIndex = 2
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${startCostCredits} credits bij reserveren`))
        it('matches credits per kWh', () =>
          expect(this.text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/ka-simpel_2_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoKleinAbonnement', url)
        })
        it('still has the same free time range as of 01/01/2021', () =>
        expect(this.ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
      })
      describe('groot abonnement', () => {
        const { freeTimeRange, startCostCredits, creditsPerKwh } = settings['Partago groot abonnement'].variables
        const planIndex = 3
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${startCostCredits} credits bij reserveren`))
        it('matches credits per kWh', () =>
          expect(this.text).toContain(` ${creditsPerKwh} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/ga-simpel_2_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoGrootAbonnement', url)
        })
        it('still has the same free time range as of 01/01/2021', () =>
        expect(this.ritPrijzen[planIndex]).toContain(`gratis tussen ${freeTimeRange[0]} en ${freeTimeRange[1]}`))
      })
    })
    describe('coop formule', () => {
      const { euroPerKw } = settings['Partago coop'].variables
      const planIndex = 4
      it('still has price of 01/01/2021', () => {
        const text = this.frag.textContent
          .split('Bye bye tijdstress?')[1]
          .split('Elke maand betaal je de gemaakte ritten met domiciliëring')[0]
        expect(text).toContain(`${euroPerKw.toLocaleString('nl-BE')}0 euro per kWh.`)
      })
    })
  })
  describe('GreenMobility', () => {
    beforeAll(async () => {
      const response = await fetch('https://www.greenmobility.com/be/nl/prijzen/')
      this.frag = document.createRange().createContextualFragment(await response.text())
    })
    describe('prePaid', () => {
      beforeAll(() => {
        this.text = this.frag.textContent
            .split('Prepaid minuten')[1]
            .split('Uur-en dagpakketten')[0]
        this.textBlocks = this.text.split('Kies in de app')
      })
      const expectCorrectFormulaValuesFor = (index, name) => {
        const { price, timeMin } = settings[`GreenMobility prepaid ${name}`].variables
        expect(this.textBlocks[index]).toMatch(new RegExp(`${price} Euro\\s*${timeMin}min`))
      }
      describe('25 euro', () => 
        it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(0, '25 euro')))
      describe('50 euro', () => 
        it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(1, '50 euro')))
      describe('150 euro', () => 
        it('still has the value of 01/01/2021', () => expectCorrectFormulaValuesFor(2, '150 euro')))
    })
    describe('uur- en dagpakketten', () => {
      beforeAll(() => {
        this.text = this.frag.textContent.split('Uur-en dagpakketten')[1]
        this.textBlocks = this.text.split('Kies in de app')})
      const { variables: { overDistancePerKm, overTimeCost } } = settings['GreenMobility 3 uur pakket']
      describe('over distance', () =>
        it('still costs the same as of 01/01/2021', 
          () => expect(this.text).toContain(`Als je meer rijdt dan de kilometers in jouw pakket, zal elke kilometer daarna € ${overDistancePerKm.toLocaleString('nl-BE')}/km kosten`)))
      describe('over time', () =>
        it('still costs the same as of 01/01/2021', 
          () => expect(this.text).toContain(`Anders rijd je verder aan € ${overTimeCost.toLocaleString('nl-BE')}/minuut.`)))
      const expectCorrectValuesFor = (index, values, unitNl) => {
        const [[unitEn, value]] = Object.entries(values)
        const { variables: { price, maxDistance, maxTime } } = settings[`GreenMobility ${value} ${unitNl} pakket`]
        const duration = luxon.Duration.fromObject({ minutes: maxTime, locale: 'nl-BE' })
        const period = `${duration.as(unitEn)}${unitNl}`
        expect(this.textBlocks[index]).toMatch(new RegExp(`${price} Euro\\s*${period}[\\s\\S]*incl. ${maxDistance} km`))
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
})