angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$mdSidenav', '$scope', function(gameService, $mdSidenav, $scope) {
    var vm = this;

    vm.channelMembers = [];

    vm.gameService = gameService;
    vm.setPhaseState = setPhaseState;
    vm.refreshPress = refreshPress;
    // vm.openPressChannel = openPressChannel;
    vm.channelMembersAsParam = channelMembersAsParam;

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function refreshPress() {
        return gameService.getPressChannels(vm.service.game)
        .then(function(channels) {
            vm.channels = channels;
        });
    }

    // function openPressChannel(channel) {
    //     channel = channel || vm.channelMembers;
    //
    //     // Channel must contain player.
    //     var currentPlayerNation = gameService.getCurrentUserInGame(vm.service.game).Nation;
    //     if (channel.indexOf(currentPlayerNation) === -1)
    //         channel.shift(currentPlayerNation);
    //     $mdSidenav('press-channel').toggle();
    // }

    function channelMembersAsParam() {
        return _.map(vm.channelMembers, function(m) { return m[0]; }).join('');
    }
}]);
