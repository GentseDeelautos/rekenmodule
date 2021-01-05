describe('Model', () => {
  describe('Partago', () => {
    const startupCredits = 30
    const kWhPerKm = 15 / 100
    const creditsPerMinute = 1
    const creditsPerKWh = 15
    const creditsPerKm = creditsPerKWh * kWhPerKm
    const params = { name: 'Partago grote bundel', distance: 0, duration: 0 }

    describe('grote bundel', () => {
      const pricePerCredit = 300 / 4800 
      const startupFee = pricePerCredit * startupCredits

      it('has a startup fee', () =>
        expect(calculate(params)).toEqual(startupFee))

      it('has a price per distance', () =>
        expect(calculate({ ...params, distance: 100 }))
          .toEqual(startupFee + 100 * creditsPerKm * pricePerCredit))

      it('has a price per minute', () =>
        expect(calculate({ ...params, duration: 18 * 60 }))
          .toEqual(startupFee + (18 * 60) * creditsPerMinute * pricePerCredit))

      it('has free time per day', () =>
        expect(calculate({ ...params, duration: 18 * 60 + 1 }))
          .toEqual(startupFee + (18 * 60) * creditsPerMinute * pricePerCredit))
      xit('has limited free time per day', () =>
        expect(calculate({ ...params, duration: 24 * 60 + 1 }))
          .toEqual(startupFee + (18 * 60 + 1) * creditsPerMinute * pricePerCredit))
    })
  })
  describe('Green Mobility', () =>
    describe('3 uur pakket', () => {
      const name = 'GreenMobility 3 uur pakket'

      it('can be fixed price', () =>
        expect(calculate({ name, distance: 0, duration: 0 })).toEqual(35))

      it('considers overtime', () =>
        expect(calculate({ name, distance: 0, duration: 181})).toEqual(35.25)) 
        
      it('considers exceeding distance', () =>
        expect(calculate({ name, distance: 101, duration: 0})).toEqual(35.25))
    }))
})
