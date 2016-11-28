describe('User games controller', function() {
    'use strict';

    var scope,
        createController,
        mockGameService,
        games,
        currentUser,
        waiting;

    beforeEach(function() {
        mockGameService = {
            getVariant: sinon.spy()
        };
        games = { Properties: [{
            name: 'Game 1',
            variant: 'Standard'
        }, {
            name: 'Game 2',
            variant: 'Standard'
        }, {
            name: 'Game 3',
            variant: 'Standard'
        }, {
            name: 'Chromatic Game',
            variant: 'Chromatic'
        }] };
        currentUser = {
            _id: '123'
        };
        waiting = { Properties: [] };

        angular.mock.module('diplomacy.constants');
        angular.mock.module('ngStorage');
        angular.mock.module('profile');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            createController = function(theGames, theWaitingGames, theCurrentUser) {
                return $controller('UserGamesController', {
                    $scope: scope,
                    games: theGames,
                    waiting: theWaitingGames,
                    currentUser: theCurrentUser
                });
            };
        });
    });

    it('lists the correct number of games being played', function() {
        createController(games, waiting, currentUser);
        scope.$digest();
        expect(scope.playing).to.have.lengthOf(4);
    });
});
