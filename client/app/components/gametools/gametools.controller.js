angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$mdSidenav', '$scope', function(gameService, $mdSidenav, $scope) {
    var vm = this;

    vm.channelMembers = [];

    vm.gameService = gameService;
    vm.setPhaseState = setPhaseState;
    vm.refreshPress = refreshPress;
    vm.openPressChannel = openPressChannel;

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function refreshPress() {
        return gameService.getPressChannels(vm.service.game)
        .then(function(channels) {
            vm.channels = channels;
        });
    }

    function openPressChannel(channel) {
        $mdSidenav('press-channel').toggle();
    }
}]);
