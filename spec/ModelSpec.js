describe('Model', () => {
  describe('Partago', () => {
    const startupCredits = 30
    const kWhPerKm = 15 / 100
    const creditsPerMinute = 1
    const creditsPerKwh = 15
    const creditsPerKm = creditsPerKwh * kWhPerKm
    const params = { name: 'Partago grote bundel', distance: 0, duration: 0 }

    describe('grote bundel', () => {
      const pricePerCredit = 300 / 4800 
      const startupFee = pricePerCredit * startupCredits
      const { getKeyValues, variables } = settings[params.name]
      const startTime = new Date('2021-01-01T00:00:00.00').valueOf()

      it('has a startup fee', () => 
        expect(getKeyValues({ startTime, timeRange: 0, distanceRange: 0, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime, 0, startupFee]]))

      it('has a price per distance', () =>
        expect(getKeyValues({ startTime, timeRange: 0, distanceRange: 100, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime, 100, startupFee + 100 * creditsPerKm * pricePerCredit]]))

      it('has a price per minute', () =>
        expect(getKeyValues({ startTime, timeRange: 60 * 1000, distanceRange: 0, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime + 60 * 1000, 0, startupFee + creditsPerMinute * pricePerCredit]]))

      it('can calculate ranges' , () => 
        expect(getKeyValues({ startTime, timeRange: [0, 60 * 1000], distanceRange: [0, 100], variables: { ...variables, kWhPerKm } }))
          .toEqual([
            [startTime, 0, startupFee],
            [startTime, 100, startupFee + 100 * creditsPerKm * pricePerCredit],
            [startTime + 60 * 1000, 0, startupFee + creditsPerMinute * pricePerCredit],
            [startTime + 60 * 1000, 100, startupFee + (100 * creditsPerKm + creditsPerMinute) * pricePerCredit]
          ]))
          
      // TODO: can't find a trace of the free time on the website anymore;
      // created https://www.loomio.org/d/RCqKmtpN/nachttarief for it  
      xit('has free time per day', () =>
        expect(calculate({ ...params, duration: 18 * 60 + 1 }))
          .toEqual(startupFee + (18 * 60) * creditsPerMinute * pricePerCredit))
      xit('has limited free time per day', () =>
        expect(calculate({ ...params, duration: 24 * 60 + 1 }))
          .toEqual(startupFee + (18 * 60 + 1) * creditsPerMinute * pricePerCredit))
    })
  })
  xdescribe('Green Mobility', () =>
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
