'use strict';

angular.module('userService', [])
.factory('userService', ['$localStorage', '$q', '$state', function($localStorage, $q, $state) {
    return {
        /**
         * Whether the user is authenticated with a valid and active token.
         * @return {Boolean} True if the user is authenticated.
         */
        isAuthenticated: function() {
            var user = $localStorage.theUser;
            return user && new Date(user.ValidUntil) > new Date();
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
            return $localStorage.theUser.id;
        },

        getUser: function(userID, callback) {
            // socketService.socket.emit('user:get', { ID: userID }, callback);
        }
    };
}]);
