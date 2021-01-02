describe('Formulas', () => {
  describe('Partago', () => {
    describe('abonnement en bundel', () => {
      beforeAll(async () => {
        const response = await fetch('https://www.partago.be/tarieven.html')
        const frag = document.createRange().createContextualFragment(await response.text())
        this.text = frag.textContent
          .split('Stap 2 Koop jouw bundel of activeer een abonnement')[1]
          .split('Stap 3 Om het leven gemakkelijker te maken')[0]
      })
      it('matches opstartcredits', () =>
        expect(this.text).toContain(` ${settings.Partago.variables.start} credits bij reserveren`))
      it('matches credits per kW', () =>
        expect(this.text).toContain(` ${settings.Partago.variables.creditsPerKw} credits per verbruikte kWh`))
    })
  })
})