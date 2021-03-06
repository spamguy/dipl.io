describe('Game service', function() {
    'use strict';

    var gameService,
        mockUserService,
        user,
        localStorage,
        httpBackend,
        rootScope;

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
            rootScope = $rootScope;
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        httpBackend.verifyNoOutstandingExpectation();
    });

    it('gets a list of user\'s active games', function() {
        httpBackend.expectGET('/Games/My/Started').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }]');

        var openGames;
        gameService.getAllActiveGamesForCurrentUser()
        .then(function(o) {
            openGames = o;
        });
        httpBackend.flush();
        expect(openGames).to.have.lengthOf(2);
    });

    it('gets a list of user\'s active games', function() {
        httpBackend.expectGET('/Games/My/Started').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }]');

        var games;
        gameService.getAllActiveGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games).to.have.lengthOf(2);
    });

    it('gets a list of user\'s inactive games', function() {
        httpBackend.expectGET('/Games/My/Staging').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }, { "Desc": "Game 3" }]');

        var games;
        gameService.getAllInactiveGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games).to.have.lengthOf(3);
    });

    it('gets a list of user\'s finished games', function() {
        httpBackend.expectGET('/Games/My/Finished').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }]');

        var games;
        gameService.getAllFinishedGamesForCurrentUser()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games).to.have.lengthOf(2);
    });

    it('requests a list of open games', function() {
        httpBackend.expectGET('/Games/Open').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }]');

        var openGames;
        gameService.getAllOpenGames()
        .then(function(o) {
            openGames = o;
        });
        httpBackend.flush();
        expect(openGames).to.have.lengthOf(2);
    });

    it('requests a list of archived games', function() {
        httpBackend.expectGET('/Games/Finished').respond('[{ "Desc": "Game 1" }, { "Desc": "Game 2" }]');

        var games;
        gameService.getAllArchivedGames()
        .then(function(o) {
            games = o;
        });
        httpBackend.flush();
        expect(games).to.have.lengthOf(2);
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

    it('gets a phase\'s state from the DB for old phases', function() {
        var game = { ID: 123 };

        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/PhaseStates/).respond(200);

        gameService.getPhaseState(game, { id: '456', PhaseOrdinal: 455, Resolved: true })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('gets a phase\'s state from the DB for non-players', function() {
        var game = { ID: 123, Members: [] };

        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/PhaseStates/).respond(200);

        gameService.getPhaseState(game, { id: '456', PhaseOrdinal: 455, Resolved: false })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    // Inspiration for this test courtesy of http://stackoverflow.com/a/25764025/260460.
    it('does NOT gets a phase\'s state from the DB in the active phase', function() {
        var callWasMade = false,
            game = { ID: 123, Members: [{ User: { Id: '789' }, NewestGamePhase: { } }] };

        httpBackend.when(/Game\/.+?\/Phase\/\d+\/PhaseStates/)
        .respond(function() {
            callWasMade = true;
            return [400, ''];
        });

        gameService.getPhaseState(game, { id: '456', PhaseOrdinal: 0, Resolved: false })
        .then(function(o) {
            expect(callWasMade).to.be.false;
        });

        rootScope.$digest();
    });

    it('gets a phase\'s orders', function() {
        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/Orders/).respond(200);

        gameService.getPhaseOrders('123', { id: '456', PhaseOrdinal: 455 })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    it('gets a phase\'s order options for the user if it is a player', function() {
        httpBackend.expectGET(/Game\/.+?\/Phase\/\d+\/Options/).respond(200);

        gameService.getUserOptionsForPhase({ ID: 123, Members: [{ User: { Id: '789' } }] }, { PhaseOrdinal: 241 })
        .then(function(o) {
        });
        httpBackend.flush();
    });

    // Inspiration for this test courtesy of http://stackoverflow.com/a/25764025/260460.
    it('does NOT get options from the DB if the user is not playing', function() {
        var callWasMade = false;

        httpBackend.when(/Game\/.+?\/Phase\/\d+\/Options/)
        .respond(function() {
            callWasMade = true;
            return [400, ''];
        });

        gameService.getUserOptionsForPhase({ ID: 123, Members: [{ User: { Id: 'qqq' } }] }, { PhaseOrdinal: 241 })
        .then(function(o) {
            expect(callWasMade).to.be.false;
        });

        rootScope.$digest();
    });

    describe('Readable deadline', function() {
        it('rounds off seconds in deadline', function() {
            expect(gameService.getReadableDeadline({ Started: true, ID: 123 }, {
                PhaseOrdinal: 1,
                Season: 'Spring',
                Type: 'Movement',
                Year: 1901,
                DeadlineAt: moment().add({ minutes: 3, seconds: 12, milliseconds: 144 }).toISOString(),
                Units: [
                    { Properties: { Unit: { Nation: 'Germany' } } }
                ],
                Resolutions: [
                    { Province: 'mun', Resolution: 'OK' },
                    { Province: 'den', Resolution: 'Aw Hell naw' }
                ]
            })).to.equal('3 minutes');
        });

        it('gives resolution dates of old phases', function() {
            expect(gameService.getReadableDeadline({ Finished: false, Started: true }, { DeadlineAt: new Date(), Resolved: true })).to.contain('Resolved ');
        });
    });
});
