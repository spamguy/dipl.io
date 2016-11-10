describe('Open game list controller', function() {
    'use strict';

    var scope,
        createController,
        mockUserService,
        mockGameService,
        games,
        currentUser;

    beforeEach(function() {
        mockUserService = {
            getCurrentUserID: function() { return '123'; }
        };
        mockGameService = {
            getVariant: sinon.spy()
        };
        games = [{
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
        }];
        currentUser = {
            _id: '123'
        };

        angular.mock.module('games');
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });

        inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            createController = function(theGames, theUser) {
                return $controller('GameListController', {
                    $scope: scope,
                    games: theGames,
                    user: theUser
                });
            };
        });
    });

    it('lists the correct number of games', function() {
        createController(games, currentUser);
        scope.$digest();
        expect(scope.games).to.have.lengthOf(4);
    });

    it('fetches each distinct variant only once', function() {
        createController(games, currentUser);
        scope.$digest();
        expect(scope.variants).to.have.all.keys(['Standard', 'Chromatic']);
        expect(mockGameService.getVariant.calledTwice).to.be.true;
    });
});
