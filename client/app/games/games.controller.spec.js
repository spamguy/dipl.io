describe('Open game list controller', function() {
    'use strict';

    var games,
        createController,
        mockGameService;

    beforeEach(function() {
        mockGameService = {
        };
        games = [{
            name: 'Game 1',
            variant: 'Classical'
        }, {
            name: 'Game 2',
            variant: 'Classical'
        }, {
            name: 'Game 3',
            variant: 'Classical'
        }, {
            name: 'Chromatic Game',
            variant: 'Chromatic'
        }];

        angular.mock.module('games');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        inject(function($controller, $rootScope) {
            createController = function(theGames) {
                var controller = $controller('GameListController', {
                    games: theGames
                });
                if (controller.$onInit)
                    controller.$onInit();
                return controller;
            };
        });
    });

    it('lists the correct number of games', function() {
        var vm = createController(games);
        expect(vm.games).to.have.lengthOf(4);
    });
});
