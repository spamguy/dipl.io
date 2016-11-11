describe('gameService', function() {
    'use strict';

    var gameService,
        mockUserService,
        socket,
        game;

    beforeEach(function() {
        mockUserService = {
            getCurrentUserID: function() { return '789'; }
        };
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('diplomacy.constants');
        angular.mock.module('gameService');

        game = {
            gm_id: '116',
            players: [{
                player_id: '123',
                power: 'Q'
            }, {
                player_id: '456',
                power: 'Z'
            }, {
                player_id: '789',
                power: 'N'
            }, {
                player_id: '666',
                power: 'B'
            }]
        };

        inject(function($rootScope, _gameService_) {
            gameService = _gameService_;
        });
    });

    it('gets all games for the current user', function() {
        // var gameListPromise = sinon.stub().returnsPromise();
        // gameListPromise.resolves([{ name: 'Game 1' }, { name: 'Game 2' }]);
        // socket.setEmit('game:userlist', [1,2,3]);
        // // socket.receive('game:userlist', { playerID: 123 }, gameListPromise);
        // expect(gameService.getAllGamesForCurrentUser()).to.eventually.have.length(3);
    });

    it('normalises variant names as lowercase and without spaces', function() {
        expect(gameService.getNormalisedVariantName('Very lONG variant NAME')).to.equal('verylongvariantname');
    });

    it('creates new games', function() {
        gameService.createNewGame({ });

        expect(socket.emits).to.contain.keys('game:create');
    });

    it('gets the current user\'s player in a game', function() {
        expect(gameService.getCurrentUserInGame(game).power).to.equal('N');
    });

    it('identifies the user in the correct game role', function() {
        expect(gameService.isPlayer(game)).to.be.true;
        expect(gameService.isGM(game)).to.be.false;
    });

    it('identifies whether the current user participates in some way', function() {
        expect(gameService.isParticipant(game)).to.be.true;
    });

    it('gets a player by code', function() {
        expect(gameService.getPlayerInGameByCode(game, 'Q').player_id).to.equal('123');
    });
});
