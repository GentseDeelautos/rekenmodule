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
    describe('abonnement en bundel', () => {
      beforeAll(async () => {
        const response = await fetch('https://www.partago.be/tarieven.html')
        this.frag = document.createRange().createContextualFragment(await response.text())
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
        it('still has price as of 01/01/2010', async () => {
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
        it('still has price as of 01/01/2010', async () => {
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
        it('still has price as of 01/01/2010', async () => {
          const url = '/uploads/7/3/7/4/73741293/ga-simpel_2_orig.png'
          expectImageToBeLoaded(frag, url)
          await expectImageToMatch('#partagoGrootAbonnement', url)
        })
      })
    })
  })
})