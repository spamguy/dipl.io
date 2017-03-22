/* global humanizeDuration */

/**
 * @ngdoc service
 * @name gameService
 * @description Interacts with the API to manipulate game data.
 */
angular.module('gameService', ['userService'])
.factory('gameService', ['$http', 'userService', 'Restangular', '$q', function($http, userService, Restangular, $q) {
    'use strict';

    return {
        /**
         * Gets all active games the logged-in user is playing in.
         * @memberof GameService
         * @returns {Promise} Diplicity data containing a list of games.
         */
        getAllActiveGamesForCurrentUser: function() {
            return Restangular.all('Games').all('My').all('Started').getList();
        },

        /**
         * Gets all waiting games the logged-in user has joined.
         * @memberof GameService
         * @returns {Promise} Diplicity data containing a list of games.
         */
        getAllInactiveGamesForCurrentUser: function() {
            return Restangular.all('Games').all('My').all('Staging').getList();
        },

        /**
         * Gets all finished games the logged-in user has joined.
         * @memberof GameService
         * @returns {Promise} Diplicity data containing a list of games.
         */
        getAllFinishedGamesForCurrentUser: function() {
            return Restangular.all('Games').all('My').all('Finished').getList();
        },

        getGame: function(gameID) {
            return Restangular.one('Game', gameID).get();
        },

        getPhases: function(gameID) {
            return Restangular.one('Game', gameID).all('Phases').getList();
        },

        getPhaseState: function(game, phase) {
            if (phase) {
                // The current phase can skip a DB call, courtesy of Users[].NewestGamePhase.
                return phase.Resolved
                    ? Restangular.one('Game', game.ID).one('Phase', phase.PhaseOrdinal).all('PhaseStates').getList()
                    : Promise.resolve(this.getCurrentUserInGame(game).NewestGamePhase);
            }
            else {
                return Promise.resolve(null);
            }
        },

        setPhaseState: function(game, phase, phaseState) {
            var player = this.getCurrentUserInGame(game),
                nationOfPlayer = player ? player.Nation : null;
            return phase
                ? Restangular.one('Game', game.ID).one('Phase', phase.PhaseOrdinal).all('PhaseState').one(nationOfPlayer).put(phaseState)
                : Promise.resolve(null);
        },

        /**
         * Gets all possible moves for the current user in a given phase.
         * @param  {String} game The game.
         * @param  {Object} phase  The phase.
         * @return {Promise}       A deeply nested object representing a decision tree, or { } if there are no legal moves.
         */
        getUserOptionsForPhase: function(game, phase) {
            var player = this.getCurrentUserInGame(game);

            // Non-players do not have options.
            if (player) {
                return phase
                    ? Restangular.one('Game', game.ID).one('Phase', phase.PhaseOrdinal).one('Options').get()
                    : Promise.resolve(null);
            }
            else {
                return Promise.resolve(null);
            }
        },

        getPhaseOrders: function(gameID, phase) {
            return phase
                ? Restangular.one('Game', gameID).one('Phase', phase.PhaseOrdinal).all('Orders').getList()
                : Promise.resolve(null);
        },

        getAllOpenGames: function() {
            return Restangular.all('Games').all('Open').getList();
        },

        getAllArchivedGames: function() {
            return Restangular.all('Games').all('Finished').getList();
        },

        /**
         * Creates new game and automatically joins it.
         * @param  {Object} game The game to save.
         * @return {Promise}     The saved game's promise.
         */
        createNewGame: function(game) {
            return Restangular.all('Game').post(game);
        },

        /**
         * @description Signs the current user up for a game.
         * @param {Object} game      A game.
         * @param {Object} [options] Power preferences, if allowed.
         * @return {Promise}         The user's promise.
         */
        joinGame: function(game, options) {
            return Restangular.one('Game', game.ID).customPOST({ }, 'Member');
        },

        /**
         * Updates orders for a single unit.
         * @param  {Object} game  The game.
         * @param  {Object} phase The phase owning the order.
         * @param  {Object} phase  The phase being modified.
         * @param  {Function} callback The callback to execute after completion.
         */
        publishOrder: function(game, phase, order) {
            return Restangular.one('Game', game.ID).one('Phase', phase.PhaseOrdinal).customPOST({ Parts: order }, 'Order')
            .then(function() {
                return order;
            });
        },

        getCurrentUserInGame: function(game) {
            return _.find(game.Members, ['User.Id', userService.getCurrentUserID()]);
        },

        isPlayer: function(game) {
            return !!this.getCurrentUserInGame(game);
        },

        getStatusDescription: function(variant, game, phase) {
            var playersNeeded;

            if (!game.Finished) {
                if (!game.Started && variant) {
                    playersNeeded = variant.Nations.length - game.Members.length;
                    return 'Not started: waiting on ' + playersNeeded + ' more ' + pluralize('player', playersNeeded);
                }
                else if (game.Started && phase) {
                    return phase.Season + ' ' + phase.Type + ' ' + phase.Year;
                }
            }
            else {
                return 'Finished';
            }
        },

        getReadableDeadline: function(game, phase) {
            var timeUntilDeadline;
            if (!game.Finished) {
                if (game.Started && phase) {
                    if (phase.Resolved) {
                        return 'Resolved ' + moment(phase.DeadlineAt).format('l, LT');
                    }
                    else {
                        timeUntilDeadline = new Date(phase.DeadlineAt).getTime() - new Date().getTime();
                        return humanizeDuration(timeUntilDeadline, {
                            largest: 2,
                            round: true,
                            units: ['mo', 'w', 'd', 'h', 'm']
                        });
                    }
                }

                // TODO: Handle paused states.
            }
            else {
                return '';
            }
        }
    };
}]);
