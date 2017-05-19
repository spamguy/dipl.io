angular.module('diplomacy.main')
.controller('HomeController', ['$http', 'CONST', '$localStorage', '$state', '$stateParams', '$window', 'Restangular', function($http, CONST, $localStorage, $state, $stateParams, $window, Restangular) {
    'use strict';

    if ($stateParams['fake-id']) {
        $localStorage.username = $stateParams['fake-id'];
        $state.go('main.login');
    }

    var vm = this;

    vm.$onInit = function() {
        angular.extend(vm, {
            user: {
                login: function() {
                    $window.location = CONST.diplicityEndpoint + '/Auth/Login?redirect-to=' +
                    encodeURIComponent(CONST.domain + '/main/login');
                }
            }
        });
    };
}]);
