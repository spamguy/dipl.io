angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$mdSidenav', 'pressService', function(gameService, $mdSidenav, PressService) {
    var vm = this,
        ps = new PressService(vm.service.game);

    // Refresh channel list when sidenav closes.
    Promise.all([
        $mdSidenav('press-channel', true),
        Promise.resolve(vm)
    ])
    .spread(function(sidenav, vm) {
        sidenav.onClose(function() {
            vm.refreshChannelList();
        });
    });

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
