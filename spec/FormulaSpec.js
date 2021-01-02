describe('Formulas', () => {
  describe('Partago', () => {
    describe('abonnement en bundel', () => {
      beforeAll(async () => {
        const response = await fetch('https://www.partago.be/tarieven.html')
        const frag = document.createRange().createContextualFragment(await response.text())
        this.text = frag.querySelector('h2.wsite-content-title:nth-child(4) + div td:nth-child(4)').textContent
        // TODO: zoek op titel ipv. op css
      })
      it('matches opstartcredits', () =>
        expect(this.text).toContain(' 30 credits bij reserveren'))
      it('matches credits per kW', () =>
        expect(this.text).toContain(' 15 credits per verbruikte kWh'))
    })
  })
})