describe('Game list variant filter', function() {
    'use strict';

    var filter;

    beforeEach(function() {
        angular.mock.module('games');

        inject(function($filter) {
            filter = $filter('variant');
        });
    });

    it('matches against variant names', function() {
        expect(
            filter([
                { variant: 'Standard' }, { variant: 'Standard' }, { variant: 'Chromatic' }
            ], 'Standard').length)
        .to.equal(2);
    });

    it('is case-insensitive', function() {
        expect(
            filter([
                { variant: 'Standard' }, { variant: 'standard' }, { variant: 'stANDard' }
            ], 'STANdard').length)
        .to.equal(3);
    });
});
