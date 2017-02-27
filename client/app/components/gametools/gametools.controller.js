angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$mdSidenav', 'pressService', function(gameService, $mdSidenav, PressService) {
    var vm = this,
        ps = new PressService(vm.service.game);

    vm.channelMembers = [];

    vm.gameService = gameService;
    vm.setPhaseState = setPhaseState;
    vm.refreshChannelList = refreshChannelList;
    vm.channelMembersAsParam = channelMembersAsParam;

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function refreshChannelList() {
        return ps.getChannels()
        .then(function(channels) {
            vm.channels = channels;
        });
    }

    function channelMembersAsParam() {
        return _.map(vm.channelMembers, function(m) { return m[0]; }).join('');
    }
}]);
