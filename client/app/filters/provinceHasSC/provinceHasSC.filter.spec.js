describe('provinceHasSC filter', function() {
    var filter;

    beforeEach(function() {
        angular.mock.module('diplomacy');

        inject(function($filter) {
            filter = $filter('provinceHasSC');
        });
    });

    it('filters provinces by the presence of a supply centre', function() {
        expect(filter([
            { p: 'RUH', sc: null },
            {
                p: 'BER',
                sc: {
                    owner: null,
                    location: { x: 1, y: 1 }
                }
            }
        ]).length).to.equal(1);
    });
});
