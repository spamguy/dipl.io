'use strict';

angular.module('diplomacy.main')
.controller('LoginController', ['$http', '$localStorage', '$state', '$stateParams', 'CONST', 'userService', function($http, $localStorage, $state, $stateParams, CONST, userService) {
    var url = CONST.diplicityEndpoint,
        token = $stateParams.token,
        username = $localStorage.username;

    // Use received token or spoofed user, whichever is available.
    if (token) {
        url += '?token=' + token;
        if (!$localStorage.token)
            $localStorage.token = token;
    }
    else if (username) {
        url += '?fake-id=' + username;
    }
    else {
        $state.go('main.home');
    }

    // Retain user data and move to user's game list.
    if (token || username) {
        $http.get(url, {
            headers: { 'Accept': 'application/json' }
        })
        .then(function(payload) {
            if (payload.data.Properties.User) {
                $localStorage.theUser = payload.data.Properties.User;

                userService.applyTokens();
                $state.go('profile.games');
            }
            else {
                return $state.go('main.home');
            }
        });
    }
}]);
