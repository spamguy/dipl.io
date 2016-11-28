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

    it('requests a list of variants', function() {
        httpBackend.expectGET('/Variants').respond('{ "Properties": [{ "Name": "Classical" }, { "Name": "Fleet Rome" }] }');

        var variants;
        gameService.getAllVariants()
        .then(function(vr) {
            variants = vr;
        });
        httpBackend.flush();
        expect(variants.Properties).to.have.lengthOf(2);
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
});
