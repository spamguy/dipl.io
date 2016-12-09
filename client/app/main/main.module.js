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
        controller: 'HomeController as vm'
    })
    .state('main.signup', {
        url: '/signup',
        templateUrl: 'app/main/signup/signup.html',
        controller: 'SignupController'
    })
    .state('main.login', {
        url: '/login?token&fake-id',
        template: ' ',
        controller: 'LoginController'
    });
}]);
