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
    }

    // Populate keys.
    for (key in $scope.variants)
        $scope.variants[key] = gameService.getVariant(key);
}]);
