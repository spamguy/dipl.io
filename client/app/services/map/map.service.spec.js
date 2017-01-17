describe('Map service', function() {
    'use strict';

    var variant,
        game,
        phases,
        orders,
        currentState,
        mockGameService,
        mockVariantService,
        MapService,
        ms,
        location;

    beforeEach(function() {
        mockGameService = {
            isPlayer: function() { return true; },
            getCurrentUserInGame: function() { return 'Germany'; }
        };

        angular.mock.module('mapService');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
            $provide.value('variantService', mockVariantService);
        });

        variant = {
            Name: 'Classical',
            Nations: [{ }, { }, { }, { }],
            Graph: {
                Nodes: {
                    MUN: {
                        sc: {
                            x: 123,
                            y: 456
                        }
                    }
                }
            }
        };
        game = {
            Desc: 'My Game 1',
            Started: true,
            Finished: false,
            Members: [{ }]
        };
        phases = [{
            Properties: {
                PhaseOrdinal: 1,
                Season: 'Spring',
                Type: 'Movement',
                Year: 1901
            }
        }, {
            Properties: {
                PhaseOrdinal: 2,
                Season: 'Summer',
                Type: 'Retreat',
                Year: 1901
            }
        }, {
            Properties: {
                PhaseOrdinal: 3,
                Season: 'Fall',
                Type: 'Movement',
                Year: 1901,
                DeadlineAt: moment().add({ minutes: 3, seconds: 12, milliseconds: 144 }).toISOString(),
                Units: [
                    { Properties: { Unit: { Nation: 'Germany' } } }
                ]
            }
        }];
        currentState = { };
        orders = [];

        inject(function(_mapService_, _$location_) {
            location = _$location_;
            MapService = _mapService_;
            ms = new MapService(variant, game, phases, orders, currentState);
        });
    });

    it('exposes variant/game/phase data, but not ordinal', function() {
        expect(ms.variant).to.not.be.undefined;
        expect(ms.game).to.not.be.undefined;
        expect(ms.phases).to.not.be.undefined;
        expect(ms.phases).to.be.an('Array');
        expect(ms.currentState).to.not.be.undefined;
        expect(ms._ordinal).to.be.undefined;
    });

    it('returns the appropriate phase by its ordinal', function() {
        expect(ms.getCurrentPhase().Properties.Season).to.equal('Fall');

        ms = new MapService(variant, game, phases, orders, currentState, 2);
        expect(ms.getCurrentPhase().Properties.Season).to.equal('Summer');
    });

    it('determines if the user can submit phase-appropriate orders', function() {
        expect(ms.userCanPerformAction('Movement')).to.be.true;
        expect(ms.userCanPerformAction('Retreat')).to.be.false;
    });

    describe('SC generation', function() {
        it('generates an SVG path', function() {
            location.path('/games/123456');
            expect(ms.getSCPath()).to.have.string('/games/123456#sc');
        });

        it('generates an SVG transform', function() {
            expect(ms.getSCTransform(variant.Graph.Nodes.MUN)).to.equal('translate(123,456) scale(0.04)');
        });
    });

    describe('Status description', function() {
        it('displays the correct phase, phase type, and year during active games', function() {
            expect(ms.getStatusDescription()).to.equal('Fall Movement 1901');
        });

        it('displays the number of remaining needed players during new games', function() {
            // 'players' for multiple.
            game.Started = false;
            expect(ms.getStatusDescription()).to.equal('Not started: waiting on 3 more players');

            // 'player' for one.
            game.Members = [{ }, { }, { }];
            expect(ms.getStatusDescription()).to.equal('Not started: waiting on 1 more player');
        });

        it('displays a completion message if the game is completed', function() {
            game.Finished = true;
            expect(ms.getStatusDescription()).to.equal('Finished');
        });
    });

    describe('Readable deadline', function() {
        it('rounds off seconds in deadline', function() {
            expect(ms.getReadableDeadline()).to.equal('3 minutes');
        });
    });

    describe('Order input', function() {
        xit('returns a null promise when no order is submittable', function() {
            return expect(ms.inputOrder('mun')).to.eventually.equal(null);
        });

        it('sets and gets the current action', function() {
            ms.setCurrentAction('Move');
            expect(ms.getCurrentAction()).to.equal('Move');
        });
    });
});
