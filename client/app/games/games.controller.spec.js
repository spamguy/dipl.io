describe('Open game list controller', function() {
    'use strict';

    var games,
        createController;

    beforeEach(function() {
        games = {
            Properties: [{
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
            }]
        };

        angular.mock.module('games');

        inject(function($controller, $rootScope) {
            createController = function(theGames) {
                return $controller('GameListController', {
                    games: theGames
                });
            };
        });
    });

    it('lists the correct number of games', function() {
        var vm = createController(games);
        expect(vm.games).to.have.lengthOf(4);
    });
});
