'use strict';

angular.module('profile', [
    'ui.router',
    'gameService',
    'ngMaterial',
    'restangular'
])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('profile', {
        url: '/profile',
        abstract: true,
        template: '<ui-view />'
    })
    .state('profile.games', {
        url: '/games',
        templateUrl: 'app/profile/usergames/usergames.html',
        controller: 'UserGamesController as vm',
        data: {
            authRequired: true
        },
        resolve: {
            finished: ['gameService', function(gameService) {
                return gameService.getAllFinishedGamesForCurrentUser();
            }],
            games: ['gameService', function(gameService) {
                return gameService.getAllActiveGamesForCurrentUser();
            }],
            waiting: ['gameService', function(gameService) {
                return gameService.getAllInactiveGamesForCurrentUser();
            }]
        }
    });
}]);
