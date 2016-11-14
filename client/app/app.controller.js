'use strict';

angular.module('diplomacy')
.controller('AppController', ['$rootScope', 'userService', '$localStorage', function($rootScope, userService, $localStorage) {
    $rootScope.$storage = $localStorage;
    $rootScope.logOff = userService.logOff;
}]);
