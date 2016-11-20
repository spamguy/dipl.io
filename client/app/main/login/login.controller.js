'use strict';

angular.module('diplomacy.main')
.controller('LoginController', ['$http', '$localStorage', '$state', '$stateParams', 'CONST', 'loginService', function($http, $localStorage, $state, $stateParams, CONST, loginService) {
    if ($stateParams.token) {
        $http.get(CONST.diplicityEndpoint + '?token=' + $stateParams.token, {
            headers: { 'Accept': 'application/json' }
        })
        .then(function(payload) {
            if (payload.data.Properties.User) {
                $localStorage.token = $stateParams.token;
                $localStorage.theUser = payload.data.Properties.User;

                loginService.applyTokens();
                $state.go('profile.games');
            }
            else {
                return $state.go('main.home');
            }
        })
        .then(function(games) {

        });
    }
}]);
