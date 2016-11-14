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
        controller: 'UserGamesController',
        resolve: {
            games: ['gameService', function(gameService) {
                return gameService.getAllActiveGamesForCurrentUser();
            }],
            waiting: ['gameService', function(gameService) {
                return gameService.getAllInactiveGamesForCurrentUser();
            }]
        }
    })
    // .state('profile.view', {
    //     url: '/:id',
    //     templateUrl: 'app/profile/view/view.html',
    //     controller: 'ProfileViewController',
    //     onEnter: ['userService', '$state', function(userService, $state) {
    //         if (!userService.isAuthenticated())
    //             $state.go('main.home');
    //     }]
    // })
    .state('profile.edit', {
        url: '/edit',
        templateUrl: 'app/profile/edit/edit.html',
        controller: 'ProfileEditController',
        onEnter: ['userService', '$state', function(userService, $state) {
            userService.blockUnauthenticated();
        }]
    });
}]);
