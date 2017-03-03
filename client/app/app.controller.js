'use strict';

angular.module('diplomacy')
.controller('AppController', ['$localStorage', '$rootScope', '$state', 'userService', function($localStorage, $rootScope, $state, userService) {
    $rootScope.$storage = $localStorage;
    $rootScope.logOff = function() {
        userService.logOff();
        $state.go('main.home');
    };
}]);
