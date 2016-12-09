describe('Map service', function() {
    'use strict';

    var variant,
        game,
        phases,
        currentState,
        mockGameService,
        MapService,
        ms;

    beforeEach(function() {
        mockGameService = {

        };

        angular.mock.module('mapService');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        variant = {
            Name: 'Classical'
        };
        game = {
            Desc: 'My Game 1'
        };
        phases = [{ id: '123' }, { id: '456' }, { id: '789' }];
        currentState = { };

        inject(function(_mapService_) {
            MapService = _mapService_;
            ms = new MapService(variant, game, phases, currentState);
        });
    });

    it('exposes variant/game/phase data', function() {
        expect(ms.variant).to.not.be.undefined;
        expect(ms.game).to.not.be.undefined;
        expect(ms.phases).to.not.be.undefined;
        expect(ms.phases).to.be.an('Array');
        expect(ms.currentState).to.not.be.undefined;
    });

    it('returns the current phase', function() {
        expect(ms.getCurrentPhase().id).to.equal('789');
    });
});
