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
      it('matches opstartcredits', () =>
        expect(this.text).toContain(` ${settings.Partago.variables.start} credits bij reserveren`))
      it('matches credits per kW', () =>
        expect(this.text).toContain(` ${settings.Partago.variables.creditsPerKw} credits per verbruikte kWh`))
      describe('bundel', () => {
        it('still has price as of 01/01/2010', async () => {
          const img = this.frag.querySelector('img[src="/uploads/7/3/7/4/73741293/gb-simpel_2_orig.png"]')
          const refImg = document.querySelector('#partagoGroteBundel')
          expect(img).toBeDefined()
          const response = await fetch('https://www.partago.be/uploads/7/3/7/4/73741293/gb-simpel_2_orig.png')
          const blob = await response.blob()
          const reader = new window.FileReader()
          reader.readAsDataURL(blob)
          await new Promise(resolve => reader.onloadend = resolve)
          expect(reader.result).toEqual(refImg.getAttribute('src'))
        })
      })
    })
  })
})