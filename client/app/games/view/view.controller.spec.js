describe('Game view controller', function() {
    'use strict';

    var scope,
        mockUserService,
        mockGameService,
        mockMapService,
        game,
        powers,
        svg,
        createController;

    beforeEach(function() {
        powers = {

        };
        game = {
            gm_id: '123'
        };
        svg = { data: new DOMParser().parseFromString('<svg><g id="mouseLayer"></g></svg>', 'image/svg+xml') };

        mockUserService = {
            getCurrentUserID: function() { return '123'; }
        };
        mockGameService = {
            getCurrentUserInGame: function(game) {
                return {
                    player_id: '123',
                    power: 'G'
                };
            }
        };
        mockMapService = {

        };
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });
        angular.mock.module('mapService', function($provide) {
            $provide.value('mapService', mockMapService);
        });
        angular.mock.module('games');

        inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            createController = function(thePowers, theGame, theSVG) {
                return $controller('ViewController', {
                    $scope: scope,
                    powers: thePowers,
                    game: theGame,
                    svg: theSVG
                });
            };
        });
    });
});
