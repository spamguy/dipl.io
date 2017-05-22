describe('New game controller', function() {
    'use strict';

    var game,
        // variants,
        mockGameService,
        mockUserService;
        // createController;

    beforeEach(function() {
        game = {
            Properties: { }
        };
        // variants = {
        //     Properties: []
        // };

        mockGameService = {
            createNewGame: function() { return sinon.stub().returnsPromise().resolves(game)(); }
        };
        mockUserService = {

        };

        angular.mock.module('games');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
            $provide.value('userService', mockUserService);
        });

        inject(function($controller, $state, $rootScope) {
            // createController = function() {
            //     return $controller('NewGameController', {
            //         variants: variants
            //     });
            // };
        });
    });
});
