describe('Map service', function() {
    'use strict';

    var location,
        MapService,
        service,
        game,
        mockGameService;

    beforeEach(function() {
        mockGameService = {
            isPlayer: function(game) { return true; },
            getCurrentUserInGame: function(game) { return 'R'; }
        };

        game = {
            variant: 'Standard',
            phases: [{
                season: 'Spring Movement',
                provinces: {
                    WAR: {
                        sc: {
                            owner: 'R',
                            fill: '#141414'
                        },
                        unit: {
                            power: 'R'
                        }
                    },
                    RUM: {
                        sc: null,
                        unit: {
                            power: 'A'
                        }
                    }
                }
            }]
        };
        angular.mock.module('diplomacy.constants');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });
        angular.mock.module('mapService');

        inject(function(_mapService_, $location) {
            location = $location;
            MapService = _mapService_;
        });

        service = new MapService(game, 0);
    });

    it('retains game and phase index data', function() {
        expect(service.game).to.not.be.null;
        expect(service.phase.phaseIndex).to.equal(0);
    });

    it('generates the URL pointing to the supply centre SVG', function() {
        location.path('/games/1234');
        expect(service.getSCPath()).to.match(/\/games\/1234#sc$/);
    });

    it('sets and verifies the current action', function() {
        service.setCurrentAction('convoy');
        expect(service.isActionCurrent('convoy')).to.be.true;
    });

    describe('Move permissions', function() {
        it('checks if the user can move this season', function() {
            expect(service.userCanMove()).to.be.true;
        });

        it('checks if the user can adjust this season', function() {
            game.phases[0].season = 'Winter Adjustment';
            expect(service.userCanAdjust()).to.be.true;
        });

        it('checks if the user can retreat this season', function() {
            game.phases[0].season = 'Fall Retreat';
            expect(service.userCanRetreat()).to.be.true;
        });

        it('forbids all moves during unstarted games', function() {
            game.phases = [];
            service = new MapService(game, 0);

            expect(service.userCanMove()).to.be.false;
            expect(service.userCanRetreat()).to.be.false;
            expect(service.userCanAdjust()).to.be.false;
        });
    });
});
