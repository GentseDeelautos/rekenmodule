describe('Model', () => {
    describe('Partago', () => {
        it('has a startup fee', () => {
            expect(bereken('Partago', 0, 0)).toEqual(30 * 300 / 4800)
        })
    })
})
