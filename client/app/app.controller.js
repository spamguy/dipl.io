'use strict';

angular.module('diplomacy')
.controller('AppController', ['$rootScope', 'userService', '$localStorage', '$state', function($rootScope, userService, $localStorage, $state) {
    $rootScope.$storage = $localStorage;

    $rootScope.logOut = function() {
        $localStorage.$reset();
        $state.go('main.home');
    };
}]);
