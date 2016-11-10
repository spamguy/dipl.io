/* global moment */
/**
 * @ngdoc service
 * @name gameService
 * @description Interacts with game, variant, and move data.
 */
angular.module('gameService', ['userService'])
.factory('gameService', ['$http', 'userService', 'Restangular', '$q', function($http, userService, Restangular, $q) {
    'use strict';

    return {
        /**
         * Gets all games the logged-in user has played in.
         * @memberof GameService
         * @returns {Promise} Diplicity data containing a list of games.
         */
        getAllActiveGamesForCurrentUser: function() {
            return Restangular.all('Games').all('My').customGET('Started');
        },

        /**
         * Gets all games owned by the logged-in user.
         * @memberof GameService
         * @returns {Promise} Diplicity data containing a list of games.
         */
        getAllActiveGamesOwnedByCurrentUser: function() {
            return Restangular.all('Games').all('My').customGET('Staging');
        },

        getNormalisedVariantName: function(variantName) {
            return variantName.replace(new RegExp(' ', 'g'), '').toLowerCase();
        },

        getVariant: function(variantName) {
            variantName = this.getNormalisedVariantName(variantName);
            return $http.get('variants/' + variantName + '/' + variantName + '.json');
        },

        getVariantSVG: function(variantName) {
            if (variantName) {
                variantName = this.getNormalisedVariantName(variantName);
                return $http.get('variants/' + variantName + '/' + variantName + '.svg');
            }
            else {
                return $q(function(resolve) {
                    resolve({ });
                });
            }
        },

        getAllVariantNames: function() {
            // return $q(function(resolve) {
            //     socketService.socket.emit('variant:list', { }, function(variants) {
            //         resolve(variants);
            //     });
            // });
        },

        getGame: function(gameID) {
            // return $q(function(resolve) {
            //     if (userService.isAuthenticated()) {
            //         socketService.socket.emit('game:get', { gameID: gameID }, function(game) {
            //             resolve(game);
            //         });
            //     }
            //     else {
            //         resolve({ variant: '' });
            //     }
            // });
        },

        getPhase: function(gameID, phaseIndex) {
            // return $q(function(resolve) {
            //     if (userService.isAuthenticated()) {
            //         socketService.socket.emit('phase:get', { gameID: gameID, index: phaseIndex }, function(phase) {
            //             resolve(phase);
            //         });
            //     }
            //     else {
            //         resolve({ });
            //     }
            // });
        },

        getAllOpenGames: function() {
            // return $q(function(resolve) {
            //     if (userService.isAuthenticated()) {
            //         socketService.socket.emit('game:listopen', function(games) {
            //             resolve(games);
            //         });
            //     }
            //     else {
            //         return resolve({ });
            //     }
            // });
        },

        getAllArchivedGames: function() {
            // return $q(function(resolve) {
            //     if (userService.isAuthenticated()) {
            //         socketService.socket.emit('game:listarchives', function(games) {
            //             resolve(games);
            //         });
            //     }
            //     else {
            //         return resolve({ });
            //     }
            // });
        },

        getMoveData: function(gameID, year, phase) {
            console.warn('This method is deprecated. Moves should already be present in the game data.');

            var options = { gameID: gameID };

            // Year and phase must both be provided to be valid.
            if (year && phase) {
                options.year = year;
                options.phase = phase;
            }

            // return $q(function(resolve) {
            //     socketService.socket.emit('phase:get', options, function(phases) {
            //         resolve(phases);
            //     });
            // });
        },

        createNewGame: function(game) {
            // socketService.socket.emit('game:create', { game: game });
        },

        /**
         * @description Signs the current user up for a game.
         * @param {Object} game    A game.
         * @param {Object} [options] Power preferences, if allowed.
         * @param {Function} [callback] The callback to execute after completion.
         */
        joinGame: function(game, options, callback) {
            // options = options || { };
            // options.gameID = game.id;
            // socketService.socket.emit('game:join', options, callback);
        },

        /**
         * Updates orders for a single unit.
         * @param  {String} action  The action.
         * @param  {Object} command The unit's new command.
         * @param  {Object} phase  The phase being modified.
         * @param  {Function} callback The callback to execute after completion.
         */
        publishCommand: function(action, command, phase, callback) {
            // socketService.socket.emit('phase:setorder', {
            //     phaseID: phase.id,
            //     command: command,
            //     action: action
            // }, callback);
        },

        setReadyState: function(game, state) {
            // socketService.socket.emit('phase:toggleready', {
            //     gameID: game.id,
            //     isReady: state
            // });
        },

        adjudicateCurrentPhase: function(game, callback) {
            // socketService.socket.emit('phase:adjudicate', {
            //     gameID: game.id,
            //     playerID: userService.getCurrentUserID()
            // }, callback);
        },

        /**
         * Ends a game and awards no wins.
         * @param  {Object} game The game.
         */
        endGame: function(game) {
            // socketService.socket.emit('game:end', {
            //     gameID: game.id
            // });
        },

        /**
         * Removes a player from a game.
         * @param  {String}   playerID The player ID.
         * @param  {Object}   game     The game.
         * @param  {Boolean}  punish   Whether to penalise the player.
         * @param  {Function} callback A callback function.
         */
        removePlayer: function(playerID, game, punish, callback) {
            // socketService.socket.emit('game:leave', {
            //     gameID: game.id,
            //     playerID: playerID,
            //     punish: punish
            // }, callback);
        },

        getCurrentUserInGame: function(game) {
            if (game.gmID === userService.getCurrentUserID())
                return { power: 'GM' };
            var p = 0,
                players = game.players || [];
            for (p = 0; p < players.length; p++) {
                if (players[p].player_id === userService.getCurrentUserID())
                    return players[p];
            }

            // Just a viewer.
            return { power: null };
        },

        getPlayerInGameByCode: function(game, code) {
            return _.find(game.players, ['power', code]);
        },

        isGM: function(game) {
            return game.gmID === userService.getCurrentUserID();
        },

        isPlayer: function(game) {
            return this.getCurrentUserInGame(game).power !== null;
        },

        isParticipant: function(game) {
            return this.isGM(game) || this.isPlayer(game);
        },

        getFormattedDeadline: function(phase) {
            return moment(phase.deadline).valueOf();
        },

        getPowerData: function(variant) {
            // var options = { variant: this.getNormalisedVariantName(variant) };
            // return $q(function(resolve) {
            //     if (userService.isAuthenticated()) {
            //         socketService.socket.emit('variant:powers', options, function(powers) {
            //             resolve(powers);
            //         });
            //     }
            //     else {
            //         return resolve({ });
            //     }
            // });
        }
    };
}]);
