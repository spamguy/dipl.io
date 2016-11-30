angular.module('diplomacy.main')
.controller('HomeController', ['$http', 'CONST', '$localStorage', '$state', '$stateParams', '$window', 'Restangular', function($http, CONST, $localStorage, $state, $stateParams, $window, Restangular) {
    'use strict';

    if ($stateParams['fake-id']) {
        $localStorage['fake-id'] = $stateParams['fake-id'];
        Restangular.setDefaultRequestParams({ 'fake-id': $stateParams['fake-id'] });
        $state.go('profile.games');
    }

    var vm = this;

    angular.extend(vm, {
        user: {
            login: function() {
                $window.location = CONST.diplicityEndpoint + '/Auth/Login?redirect-to=' +
                encodeURIComponent(CONST.domain + '/main/login');
            }
        }
    });
}]);
