describe('provinceHasUnit filter', function() {
    var filter;

    beforeEach(function() {
        angular.mock.module('diplomacy');

        inject(function($filter) {
            filter = $filter('provinceHasUnit');
        });
    });

    it('filters provinces by the presence of a unit', function() {
        expect(filter([ { r: 'SPA' } ]).length).to.equal(0);
    });

    it('filters provinces by the presence of a unit type', function() {
        expect(filter([
            { r: 'SPA', unit: { type: 1 } },
            { r: 'POR', unit: { type: 2 } }
        ], 1, false).length).to.equal(1);
    });

    it('filters provinces by the presence of a dislodged unit', function() {
        expect(filter([
            { r: 'SPA', unit: { type: 1 } },
            { r: 'POR', unit: { type: 2 } },
            { r: 'MAR', unit: { type: 1 }, dislodged: { type: 1 } }
        ], 1, true).length).to.equal(1);
    });
});
