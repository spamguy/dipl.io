'use strict';

angular.module('loginService', [ ])
.factory('loginService', ['$localStorage', 'Restangular', function($localStorage, Restangular) {
    return {
        applyToken: function() {
            var token = $localStorage.token;
            if (token)
                Restangular.setDefaultRequestParams({ token: $localStorage.token });
        }
    };
}]);
