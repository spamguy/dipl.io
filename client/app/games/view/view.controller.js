'use strict';

angular.module('games')
.controller('ViewController', ['$scope', '$state', 'userService', 'gameService', 'mapService', 'game', 'phase', 'svg', 'powers', '$mdDialog', '$stateParams', function($scope, $state, userService, gameService, MapService, game, phase, svg, powers, $mdDialog, $stateParams) {
    $scope.updateProvinceData = updateProvinceData;

    $scope.powers = powers;
    $scope.currentUserInGame = gameService.getCurrentUserInGame(game);
    $scope.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    $scope.service = new MapService(game, phase, $stateParams.phaseIndex);

    this.uiOnParamsChanged = function(params) {
        var index = params.phaseIndex;

        gameService.getPhases(game.id)
        .then(function(phases) {
            $scope.service.phase = phases[index];
            $scope.$broadcast('renderphase');
        });
    };

    // Point out games that haven't started yet.
    if (game.status === 0) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Not started')
                .ok('OK')
                .textContent('This game has not started yet. No powers have been assigned.')
                .ariaLabel('Game not started')
        );
    }

    function updateProvinceData(p, action, target, targetOfTarget) {
        // Update local data to reflect DB change.
        $scope.service.phase.provinces[p].unit.action = action;
        if (target)
            $scope.service.phase.provinces[p].unit.target = target;
        if (targetOfTarget)
            $scope.service.phase.provinces[p].unit.targetOfTarget = targetOfTarget;

        $scope.$broadcast('orderChange', {
            p: p
        });
    }
}]);
