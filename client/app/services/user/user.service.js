'use strict';

angular.module('userService', [])
.factory('userService', ['$localStorage', '$state', 'Restangular', function($localStorage, $state, Restangular) {
    var service = {
        /**
         * Whether the user is authenticated with a valid and active token.
         * @return {Boolean} True if the user is authenticated.
         */
        isAuthenticated: function() {
            var user = $localStorage.theUser;
            return (user !== undefined && new Date(user.ValidUntil) > new Date());
        },

        /**
         * Check authentication state (validity and expiration) and log off if needed.
         */
        blockUnauthenticated: function() {
            if (!this.isAuthenticated())
                this.logOff();
        },

        /**
         * Clean up persisted, user-specific data and escape to an unsecured location.
         */
        logOff: function() {
            $localStorage.$reset();
            $state.go('main.home');
        },

        getCurrentUserID: function() {
            return $localStorage.theUser.Id;
        },

        /**
         * Gets this user's preferences.
         * @return {Promise} Object containing all user preferences.
         */
        getUserConfig: function() {
            var userID = $localStorage.theUser.ID;
            return Restangular.one('User', userID).getList('UserConfig');
        },

        applyTokens: function(fcmToken) {
            $localStorage.fcmToken = fcmToken;
            var token = $localStorage.token,
                username = $localStorage.username;
            if (token)
                Restangular.setDefaultHeaders({ Authorization: 'Bearer ' + token });
            else if (username)
                Restangular.setDefaultRequestParams({ 'fake-id': username });
        },

        apiErrorHandler: function(response) {
            // If Unauthorized is received, log out and indicate error as handled.
            if (response.status === 401) {
                service.logOff();
                return false;
            }

            return true;
        }
    };

    return service;
}]);
