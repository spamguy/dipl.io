angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$scope', function(gameService, $scope) {
    var vm = this;

    vm.gameService = gameService;
    vm.setPhaseState = setPhaseState;
    vm.refreshPress = refreshPress;

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function refreshPress() {
        return gameService.getPressChannels(vm.service.game)
        .then(function(channels) {
            vm.channels = channels;
        });
    }
}]);
