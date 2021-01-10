describe('Model', () => {
  describe('Partago', () => {
    const startupCredits = 30
    const kWhPerKm = 15 / 100
    const creditsPerMinute = 1
    const creditsPerKwh = 15
    const creditsPerKm = creditsPerKwh * kWhPerKm
    const params = { name: 'Partago grote bundel', distance: 0, duration: 0 }
    const freeTimeRange = ['0:00', '6:00']

    describe('grote bundel', () => {
      const pricePerCredit = 300 / 4800 
      const startupFee = pricePerCredit * startupCredits
      const { getKeyValues, variables } = settings[params.name]
      const startTime = luxon.DateTime.fromISO('2021-01-01T06:00:00.00', { zone: 'Europe/Brussels' })

      it('has a startup fee', () => 
        expect(getKeyValues({ startTime, timeRange: 0, distanceRange: 0, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime.valueOf(), 0, startupFee]]))

      it('has a price per distance', () =>
        expect(getKeyValues({ startTime, timeRange: 0, distanceRange: 100, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime.valueOf(), 100, startupFee + 100 * creditsPerKm * pricePerCredit]]))

      it('has a price per minute', () =>
        expect(getKeyValues({ startTime, timeRange: 60 * 1000, distanceRange: 0, variables: { ...variables, kWhPerKm } }))
          .toEqual([[startTime.valueOf() + 60 * 1000, 0, startupFee + creditsPerMinute * pricePerCredit]]))

      it('can calculate ranges' , () => 
        expect(getKeyValues({ startTime, timeRange: [0, 60 * 1000], distanceRange: [0, 100], variables: { ...variables, kWhPerKm } }))
          .toEqual([
            [startTime.valueOf(), 0, startupFee],
            [startTime.valueOf(), 100, startupFee + 100 * creditsPerKm * pricePerCredit],
            [startTime.valueOf() + 60 * 1000, 0, startupFee + creditsPerMinute * pricePerCredit],
            [startTime.valueOf() + 60 * 1000, 100, startupFee + (100 * creditsPerKm + creditsPerMinute) * pricePerCredit]
          ]))
          

      it('has a free time range on the first day', () => {
        expect(getKeyValues({ startTime: startTime.startOf('day'), timeRange: 60 * 1000, distanceRange: 0, variables: { ...variables, kWhPerKm, freeTimeRange } }))
          .toEqual([[startTime.startOf('day').valueOf() + 60 * 1000, 0, startupFee]])
      })

      it('has a free time range every day', () => {
        expect(getKeyValues({ startTime, timeRange: 24 * 60 * 60 * 1000, distanceRange: 0, variables: { ...variables, kWhPerKm, freeTimeRange } }))
          .toEqual([[startTime.valueOf() + 24 * 60 * 60 * 1000, 0, startupFee + creditsPerMinute * 60 * 18 * pricePerCredit]])
      })
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
