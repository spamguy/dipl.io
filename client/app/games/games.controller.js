'use strict';

angular.module('games')
.controller('GameListController', ['$scope', 'gameService', 'games', function($scope, gameService, games) {
    var i,
        theGame,
        variantName,
        key;
    $scope.variants = { };
    $scope.games = games;

    for (i = 0; i < $scope.games.length; i++) {
        theGame = $scope.games[i];

        // Identify what variants need fetching.
        variantName = theGame.variant;
        if (!$scope.variants[variantName])
            $scope.variants[variantName] = { };
    }

    for (key in $scope.variants)
        $scope.variants[key] = gameService.getVariant(key);
}]);
