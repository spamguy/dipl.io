describe('Game service', function() {
    'use strict';

    var gameService,
        mockUserService,
        user,
        localStorage,
        httpBackend;

    beforeEach(function() {
        mockUserService = {
            getCurrentUserID: function() { return '789'; }
        };
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('ngStorage');
        angular.mock.module('restangular');
        angular.mock.module('diplomacy.constants');
        angular.mock.module('gameService');

        user = {
            ID: 123
        };

        inject(function($rootScope, _gameService_, _$localStorage_, _$httpBackend_) {
            gameService = _gameService_;
            localStorage = _$localStorage_;
            localStorage.theUser = user;
            httpBackend = _$httpBackend_;
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        httpBackend.verifyNoOutstandingExpectation();
    });

    it('requests a list of open games', function() {
        httpBackend.expectGET('/Games/Open').respond('{ "Properties": [{ "Desc": "Game 1" }, { "Desc": "Game 2" }] }');

        var openGames;
        gameService.getAllOpenGames()
        .then(function(o) {
            openGames = o;
        });
        httpBackend.flush();
        expect(openGames.Properties).to.have.lengthOf(2);
    });

    it('creates a game', function() {
        httpBackend.expectPOST('/Game').respond(200);

        gameService.createNewGame({ Desc: 'My Game' })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('joins a game', function() {
        httpBackend.expectPOST(/Game\/.+?\/Member/).respond(200);

        gameService.joinGame({ Desc: 'My Game', ID: 123 })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('identifies the user as a player in a game', function() {
        var isPlayer = gameService.isPlayer({ Members: [{ User: { Id: '789' } }] });
        expect(isPlayer).to.be.true;

        isPlayer = gameService.isPlayer({ Members: [{ User: { Id: 'ZZZ' } }] });
        expect(isPlayer).to.be.false;
    });
});
