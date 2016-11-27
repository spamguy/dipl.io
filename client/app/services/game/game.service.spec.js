describe('gameService', function() {
    'use strict';

    var gameService,
        mockUserService,
        mockLocalStorage,
        socket,
        game;

    beforeEach(function() {
        mockUserService = {
            getCurrentUserID: function() { return '789'; }
        };
        mockLocalStorage = {
            theUser: { ID: '123abc' }
        };
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
            $provide.value('$localStorage', mockLocalStorage);
        });
        angular.mock.module('diplomacy.constants');
        angular.mock.module('gameService');

        game = {
            Members: [
                { ID: 123 }
            ]
        };

        inject(function($rootScope, _gameService_) {
            gameService = _gameService_;
        });
    });

    xit('gets all games for the current user', function() {
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

    it('identifies whether the user is a player in a game', function() {
        expect(gameService.isPlayer(game)).to.be.true;
    });
});
