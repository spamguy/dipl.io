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
            id: '123',
            Season: 'Spring Movement',
            Year: 1901
        }, {
            id: '456',
            Season: 'Summer Retreat',
            Year: 1901
        }, {
            id: '789',
            Season: 'Fall Movement',
            Year: 1901
        }];
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

    describe('Status description', function() {
        it('displays the correct phase and year during active games', function() {
            expect(ms.getStatusDescription()).to.equal('Fall Movement 1901');
        });

        it('displays the number of remaining needed players during new games', function() {
            game.Started = false;
            expect(ms.getStatusDescription()).to.equal('(Not started: waiting on 3 more players)');
        });

        it('displays a completion message if the game is completed', function() {
            game.Finished = true;
            expect(ms.getStatusDescription()).to.equal('Finished');
        });
    });

    xdescribe('Readable deadline', function() {
        it('displays the largest two units in deadline during active games', function() {
        });

        it('rounds off seconds in deadline', function() {
            // scope.game.phases[0].deadline = moment.utc().add({ minutes: 3, seconds: 12, milliseconds: 144 });
            // el = compile('<sg-game-list-item game="game" joinable="false"></sg-game-list-item>')(scope);
            // scope.$digest();
            // expect(el.isolateScope().readableTimer).to.equal('3 minutes, 12 seconds');
        });
    });
});
