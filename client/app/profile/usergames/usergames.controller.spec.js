describe('User games controller', function() {
    'use strict';

    var createController,
        games,
        waiting,
        mockGameService;

    beforeEach(function() {
        mockGameService = {
        };
        games = { Properties: [{
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
        }] };
        waiting = { Properties: [{
            name: 'Inactive Game 1',
            variant: 'Classical'
        }] };

        angular.mock.module('profile');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        inject(function($controller, $rootScope) {
            createController = function(theGames, theWaitingGames, theCurrentUser) {
                return $controller('UserGamesController', {
                    games: theGames,
                    waiting: theWaitingGames
                });
            };
        });
    });

    it('lists the correct number of games being played', function() {
        var vm = createController(games, waiting);
        expect(vm.playing).to.have.lengthOf(4);
    });

    it('lists the correct number of inactive games', function() {
        var vm = createController(games, waiting);
        expect(vm.waiting).to.have.lengthOf(1);
    });
});
