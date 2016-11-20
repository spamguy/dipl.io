'use strict';

angular.module('loginService', [ ])
.factory('loginService', ['$localStorage', 'Restangular', function($localStorage, Restangular) {
    return {
        applyTokens: function(fcmToken) {
            $localStorage.fcmToken = fcmToken;
            var token = $localStorage.token;
            if (token)
                Restangular.setDefaultRequestParams({ token: $localStorage.token });
        }
    };
}]);
