describe('Model', () => {
  describe('Partago', () => {
    beforeEach(() => {
      this.startupCredits = 30
      this.kWhPerKm = 15 / 100
      this.creditsPerMinute = 1
      this.creditPerKWh = 15
      this.creditsPerKm = this.creditPerKWh * this.kWhPerKm
      this.params = { name: 'Partago grote bundel', distance: 0, duration: 0 }
    })
    describe('grote bundel', () => {
      beforeEach(() => {
        this.pricePerCredit = 300 / 4800 
        this.startupFee = this.pricePerCredit * this.startupCredits
      })
      it('has a startup fee', () => {
        expect(calculate(this.params)).toEqual(this.startupFee)
      })
      it('has a price per distance', () => {
        expect(calculate({ ...this.params, distance: 100 }))
          .toEqual(this.startupFee + 100 * this.creditsPerKm * this.pricePerCredit)
      })
      it('has a price per minute', () => {
        expect(calculate({ ...this.params, duration: 18 * 60 }))
          .toEqual(this.startupFee + (18 * 60) * this.creditsPerMinute * this.pricePerCredit)
      })
      it('has free time per day', () => {
        expect(calculate({ ...this.params, duration: 18 * 60 + 1 }))
          .toEqual(this.startupFee + (18 * 60) * this.creditsPerMinute * this.pricePerCredit)
      })
      xit('has limited free time per day', () => {
        expect(calculate({ ...this.params, duration: 24 * 60 + 1 }))
            .toEqual(this.startupFee + (18 * 60 + 1) * this.creditsPerMinute * this.pricePerCredit)
      })
    })
  })
  describe('Green Mobility', () =>
    describe('3 dagen pakket', () => {
      const name = 'GreenMobility 3 uur pakket'
      it('can be fixed price', () =>
        expect(calculate({ name, distance: 0, duration: 0 })).toEqual(35))
      it('considers overtime', () =>
        expect(calculate({ name, distance: 0, duration: 181})).toEqual(35.25)) 
      it('considers exceeding distance', () =>
        expect(calculate({ name, distance: 101, duration: 0})).toEqual(35.25))
    }))
})
