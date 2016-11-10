describe('Game view controller', function() {
    'use strict';

    var scope,
        mockUserService,
        mockGameService,
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
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
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

    describe('Read-only status', function() {
        it('is read-only for GMs', function() {
            createController(powers, game, svg);
            scope.$digest();
            expect(scope.readonly).to.be.true;
        });

        it('is not read-only for players', function() {
            game.gm_id = '666';
            createController(powers, game, svg);
            scope.$digest();
            expect(scope.readonly).to.be.false;
        });
    });
});
