'use strict';

angular.module('games')
.controller('ViewController', ['$state', 'userService', 'gameService', 'mapService', 'game', 'phases', 'svg', 'variant', '$mdDialog', '$stateParams',
function($state, userService, gameService, MapService, game, phases, svg, variant, $mdDialog, $stateParams) {
    game = game.Properties;
    phases = phases.Properties;
    var vm = this;
    vm.updateProvinceData = updateProvinceData;

    vm.currentUserInGame = gameService.getCurrentUserInGame(game);
    vm.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    vm.service = new MapService(variant, game, phases, $stateParams.phaseIndex);

    // this.uiOnParamsChanged = function(params) {
    //     var index = params.phaseIndex;
    //
    //     gameService.getPhases(game.id)
    //     .then(function(phases) {
    //         vm.service.phase = phases[index];
    //         vm.$broadcast('renderphase');
    //     });
    // };

    // Point out games that haven't started yet.
    if (!game.Started) {
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
        // vm.service.phase.provinces[p].unit.action = action;
        // if (target)
        //     vm.service.phase.provinces[p].unit.target = target;
        // if (targetOfTarget)
        //     vm.service.phase.provinces[p].unit.targetOfTarget = targetOfTarget;
        //
        // vm.$broadcast('orderChange', {
        //     p: p
        // });
    }
}]);
