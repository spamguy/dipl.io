describe('Map service', function() {
    'use strict';

    var variant,
        game,
        phases,
        orders,
        currentState,
        mockGameService,
        MapService,
        ms;

    beforeEach(function() {
        mockGameService = {
            isPlayer: function() { return true; }
        };

        angular.mock.module('mapService');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        variant = {
            Name: 'Classical',
            Nations: [{ }, { }, { }, { }]
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
                DeadlineAt: moment().add({ minutes: 3, seconds: 12, milliseconds: 144 }).toISOString()
            }
        }];
        currentState = { };
        orders = [];

        inject(function(_mapService_) {
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
});
