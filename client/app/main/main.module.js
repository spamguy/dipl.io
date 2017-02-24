'use strict';

angular.module('diplomacy.main', [
    'ui.router',
    'ngMessages',
    'ngAnimate',
    'userService',
    'gameService'
    // 'angularTypewrite'
])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider
    .state('main', {
        url: '/main?fake-id',
        template: '<ui-view />',
        abstract: true
    })
    .state('main.home', {
        url: '/home',
        templateUrl: 'app/main/home/home.html',
        controller: 'HomeController as vm',
        onEnter: ['$transition$', function($transition$) {
            var userService = $transition$.injector().get('userService');

            // If user logs in, waits X days, then hits main.home, credentials need to be invalidated.
            if (!userService.isAuthenticated() && userService.getCurrentUserID())
                return userService.logOff();
        }]
    })
    .state('main.login', {
        url: '/login?token&fake-id',
        template: ' ',
        controller: 'LoginController'
    });
}]);
