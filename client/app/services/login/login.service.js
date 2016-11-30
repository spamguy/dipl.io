'use strict';

angular.module('loginService', [ ])
.factory('loginService', ['$localStorage', 'Restangular', function($localStorage, Restangular) {
    return {
        applyTokens: function(fcmToken) {
            $localStorage.fcmToken = fcmToken;
            var token = $localStorage.token,
                fakeID = $localStorage['fake-id'];
            if (token)
                Restangular.setDefaultRequestParams({ token: $localStorage.token });
            else if (fakeID)
                Restangular.setDefaultRequestParams({ 'fake-id': $localStorage['fake-id'] });
        }
    };
}]);
