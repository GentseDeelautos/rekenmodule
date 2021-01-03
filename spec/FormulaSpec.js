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
    })
    describe('abonnement en bundel', () => {
      beforeAll(() => {
        this.text = this.frag.textContent
          .split('Stap 2 Koop jouw bundel of activeer een abonnement')[1]
          .split('Stap 3 Om het leven gemakkelijker te maken')[0]
      })
      describe('grote bundel', () => {
        const variables = settings['Partago grote bundel'].variables
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${variables.start} credits bij reserveren`))
        it('matches credits per kW', () =>
          expect(this.text).toContain(` ${variables.creditsPerKw} credits per verbruikte kWh`))
        it('still has price as of 01/01/2010', async () => {
          const url = '/uploads/7/3/7/4/73741293/gb-simpel_2_orig.png'
          expectImageToBeLoaded(this.frag, url)
          await expectImageToMatch('#partagoGroteBundel', url)
        })
      })
      describe('kleine bundel', () => {
        const variables = settings['Partago kleine bundel'].variables
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${variables.start} credits bij reserveren`))
        it('matches credits per kW', () =>
          expect(this.text).toContain(` ${variables.creditsPerKw} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/kb-plain-final-100dpi_8_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoKleineBundel', url)
          const refImg = document.querySelector('#partagoKleineBundel')
        })
      })
      describe('klein abonnement', () => {
        const variables = settings['Partago klein abonnement'].variables
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${variables.start} credits bij reserveren`))
        it('matches credits per kW', () =>
          expect(this.text).toContain(` ${variables.creditsPerKw} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/ka-simpel_2_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoKleinAbonnement', url)
        })
      })
      describe('groot abonnement', () => {
        const variables = settings['Partago groot abonnement'].variables
        it('matches opstartcredits', () =>
          expect(this.text).toContain(` ${variables.start} credits bij reserveren`))
        it('matches credits per kW', () =>
          expect(this.text).toContain(` ${variables.creditsPerKw} credits per verbruikte kWh`))
        it('still has price as of 01/01/2021', async () => {
          const url = '/uploads/7/3/7/4/73741293/ga-simpel_2_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoGrootAbonnement', url)
        })
      })
    })
    describe('coop formule', () => {
      const variables = settings['Partago coop'].variables
      it('still has price of 01/01/2021', () => {
        const text = this.frag.textContent
          .split('Wil je geen tijdstress?')[1]
          .split('Elke maand betaal je de gemaakte ritten met domiciliëring')[0]
        expect(text).toContain(`${variables.euroPerKw.toLocaleString('nl-BE')}0 euro per kWh.`)
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
      describe('25 euro', () => 
        it('still has the value of 01/01/2021', () => expect(this.textBlocks[0]).toMatch(/25 Euro\s*75min/)))
      describe('50 euro', () => 
        it('still has the value of 01/01/2021', () => expect(this.textBlocks[1]).toMatch(/50 Euro\s*175min/)))
      describe('150 euro', () => 
        it('still has the value of 01/01/2021', () => expect(this.textBlocks[2]).toMatch(/150 Euro\s*600min/)))
    })
    describe('uur- en dagpakketten', () => {
      beforeAll(() => {
        this.text = this.frag.textContent.split('Uur-en dagpakketten')[1]
        this.textBlocks = this.text.split('Kies in de app')})
      describe('overtime', () =>
        it('still costs the same as of 01/01/2021', 
          () => expect(this.text).toContain('Als je meer rijdt dan de kilometers in jouw pakket, zal elke kilometer daarna € 0,25/km kosten')))
      describe('3 uur', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[0]).toMatch(/35 Euro\s*3uur[\s\S]*incl. 100 km/)))
      describe('5 uur', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[1]).toMatch(/45 Euro\s*5uur[\s\S]*incl. 150 km/)))
      describe('10 uur', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[2]).toMatch(/60 Euro\s*10uur[\s\S]*incl. 150 km/)))
      describe('1 dag', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[3]).toMatch(/75 Euro\s*1dag[\s\S]*incl. 200 km/)))
      describe('2 dagen', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[4]).toMatch(/125 Euro\s*2dagen[\s\S]*incl. 400 km/)))
      describe('3 dagen', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[5]).toMatch(/175 Euro\s*3dagen[\s\S]*incl. 600 km/)))
      describe('7 dagen', () =>
        it('still means the same as of 01/01/2021', () => expect(this.textBlocks[6]).toMatch(/350 Euro\s*7dagen[\s\S]*incl. 1000 km/)))
    })
  })
})