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

    it('gets a list of user\'s active games', function() {
        httpBackend.expectGET('/Games/My/Started').respond('{ "Properties": [{ "Desc": "Game 1" }, { "Desc": "Game 2" }] }');

        var openGames;
        gameService.getAllActiveGamesForCurrentUser()
        .then(function(o) {
            openGames = o;
        });
        httpBackend.flush();
        expect(openGames.Properties).to.have.lengthOf(2);
    });

    it('gets a list of user\'s active games', function() {
        httpBackend.expectGET('/Games/My/Started').respond('{ "Properties": [{ "Desc": "Game 1" }, { "Desc": "Game 2" }] }');

        var games;
        gameService.getAllActiveGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games.Properties).to.have.lengthOf(2);
    });

    it('gets a list of user\'s inactive games', function() {
        httpBackend.expectGET('/Games/My/Staging').respond('{ "Properties": [{ "Desc": "Game 1" }, { "Desc": "Game 2" }, { "Desc": "Game 3" }] }');

        var games;
        gameService.getAllInactiveGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games.Properties).to.have.lengthOf(3);
    });

    it('gets a list of user\'s finished games', function() {
        httpBackend.expectGET('/Games/My/Finished').respond('{ "Properties": [{ "Desc": "Game 1" }, { "Desc": "Game 2" }] }');

        var games;
        gameService.getAllFinishedGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games.Properties).to.have.lengthOf(2);
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

    it('identifies which player in a game is the user', function() {
        expect(gameService.getCurrentUserInGame({
            Members: [
                { User: { Id: '123' }, Nation: 'Russia' },
                { User: { Id: '456' }, Nation: 'Germany' },
                { User: { Id: '789' }, Nation: 'France' }
            ]
        }).Nation).to.equal('France');
    });

    it('gets a game', function() {
        httpBackend.expectGET(/Game\/.+?/).respond(200);

        gameService.getGame('123')
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('gets game phases', function() {
        httpBackend.expectGET(/Game\/.+?\/Phases/).respond(200);

        gameService.getPhases('123')
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('gets a phase\'s state', function() {
        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/PhaseStates/).respond(200);

        gameService.getPhaseState('123', { id: '456', PhaseOrdinal: 455 })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('gets a phase\'s orders', function() {
        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/Orders/).respond(200);

        gameService.getPhaseOrders('123', { id: '456', PhaseOrdinal: 455 })
        .then(function(o) {
        });
        httpBackend.flush();
    });
});
