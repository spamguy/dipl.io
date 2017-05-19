describe('User games controller', function() {
    'use strict';

    var createController,
        finished,
        games,
        waiting,
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
        waiting = [{
            name: 'Inactive Game 1',
            variant: 'Classical'
        }];
        finished = [{
            name: 'Finished Game 1',
            variant: 'Classical'
        }, {
            name: 'Finished Game 2',
            variant: 'Fleet Rome'
        }];

        angular.mock.module('profile');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        inject(function($controller, $rootScope) {
            createController = function(theGames, theWaitingGames, theFinishedGames) {
                var controller = $controller('UserGamesController', {
                    finished: theFinishedGames,
                    games: theGames,
                    waiting: theWaitingGames
                });
                if (controller.$onInit)
                    controller.$onInit();
                return controller;
            };
        });
    });

    it('lists the correct number of games being played', function() {
        var vm = createController(games, waiting, finished);
        expect(vm.playing).to.have.lengthOf(4);
    });

    it('lists the correct number of inactive games', function() {
        var vm = createController(games, waiting, finished);
        expect(vm.waiting).to.have.lengthOf(1);
    });

    it('lists the correct number of finished games', function() {
        var vm = createController(games, waiting, finished);
        expect(vm.finished).to.have.lengthOf(2);
    });
});
