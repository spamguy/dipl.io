'use strict';

angular.module('loginService', [ ])
.factory('loginService', ['$localStorage', 'Restangular', function($localStorage, Restangular) {
    return {
        applyTokens: function(fcmToken) {
            $localStorage.fcmToken = fcmToken;
            var token = $localStorage.token,
                username = $localStorage.username;
            if (token)
                Restangular.setDefaultRequestParams({ token: token });
            else if (username)
                Restangular.setDefaultRequestParams({ 'fake-id': username });
        }
    };
}]);
