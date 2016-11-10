'use strict';

angular.module('games')
.controller('NewGameController', ['$scope', 'gameService', 'userService', '$state', 'variants', function($scope, gameService, userService, $state, variants) {
    var user = $scope.$storage.theUser;
    angular.extend($scope, {
        game: {
            name: null,
            description: null,
            year: null,
            phase: null,
            variant: 'Standard',
            move: {
                days: 1,
                hours: 0,
                minutes: 0
            },
            retreat: {
                days: 1,
                hours: 0,
                minutes: 0
            },
            adjust: {
                days: 1,
                hours: 0,
                minutes: 0
            },
            visibility: 'public',
            press: 'white',
            minimumScoreToJoin: 0,
            gmID: userService.getCurrentUserID(),

            save: function() {
                gameService.getVariant($scope.game.variant).then(function(variant) {
                    $scope.game.maxPlayers = _.keys(variant.data.powers).length;
                    gameService.createNewGame($scope.game);
                    $state.go('profile.games');
                });
            }
        }
    });

    $scope.variants = variants;

    $scope.minimumDedicationToGM = 0;
    $scope.dedication = ((user.actionCount - user.failedActionCount) / user.actionCount) * 100;
    $scope.hasDecentScore = function() {
        return $scope.dedication >= $scope.minimumDedicationToGM;
    };
}]);
