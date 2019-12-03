describe('Model', () => {
    describe('Partago', () => {
        beforeEach(() => {
            this.startupCredits = 30
            this.kWhPerKm = 15 / 100
            this.creditsPerMinute = 1
            this.creditPerKWh = 15
            this.creditsPerKm = this.creditPerKWh * this.kWhPerKm
            this.params = { name: 'Partago', km: 0, min: 0 }
        })
        describe('grote bundel', () => {
            beforeEach(() => {
                this.pricePerCredit = 300 / 4800 
                this.startupFee = this.pricePerCredit * this.startupCredits
            })
            it('has a startup fee', () => {
                expect(bereken(this.params)).toEqual(this.startupFee)
            })
            it('has a price per km', () => {
                expect(bereken({ ...this.params, km: 100 }))
                    .toEqual(this.startupFee + 100 * this.creditsPerKm * this.pricePerCredit)
            })
            it('has a price per minute', () => {
                expect(bereken({ ...this.params, min: 18 * 60 }))
                    .toEqual(this.startupFee + (18 * 60) * this.creditsPerMinute * this.pricePerCredit)
            })
            it('has free time per day', () => {
                expect(bereken({ ...this.params, min: 18 * 60 + 1 }))
                    .toEqual(this.startupFee + (18 * 60) * this.creditsPerMinute * this.pricePerCredit)
            })
            xit('has limited free time per day', () => {
                expect(bereken({ ...this.params, min: 24 * 60 + 1 })).toEqual(this.startupFee + (18 * 60 + 1) * this.creditsPerMinute * this.pricePerCredit)
            })
        })
    })
})
