'use strict';

angular.module('profile')
.controller('UserGamesController', ['$http', '$localStorage', '$scope', '$state', '$stateParams', 'CONST', 'gameService', 'games', 'waiting',
function($http, $localStorage, $scope, $state, $stateParams, CONST, gameService, games, waiting) {
    var i,
        theGame,
        variantName,
        key;

    $scope.selectedIndex = 0;

    $scope.variants = { };
    $scope.moves = { };

    $scope.playing = games.Properties;
    $scope.waiting = waiting.Properties;

    for (i = 0; i < games.length; i++) {
        theGame = games[i];

        // Identify what variants need fetching.
        variantName = theGame.variant;
        if (!$scope.variants[variantName])
            $scope.variants[variantName] = { };

        /*
         * Identify the extent of each game's move data to get, given these rules:
         *     1) Old phases are fully exposed: old positions, moves, resolution.
         *     2) Current phases expose old positions.
         *     3) Players see their own orders in current phases.
         */
    }

    // Populate keys.
    for (key in $scope.variants)
        $scope.variants[key] = gameService.getVariant(key);
}]);
