angular.module('gametools.component')
.controller('GameToolsController', ['gameService', '$scope', function(gameService, $scope) {
    var vm = this;

    vm.selectedItem = null;
    vm.nationSearchText = null;
    vm.selectedNations = [];

    vm.gameService = gameService;
    vm.setPhaseState = setPhaseState;
    vm.refreshPress = refreshPress;
    vm.searchNations = searchNations;

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function refreshPress() {
        return gameService.getPressChannels(vm.service.game)
        .then(function(channels) {
            vm.channels = channels;
        });
    }

    function searchNations(query) {
        var n = 0,
            results = [];

        for (; n < vm.service.variant.Nations.length; n++) {
            if (_.startsWith(vm.service.variant.Nations[n].toLowerCase(), query.toLowerCase()))
                results.push(vm.service.variant.Nations[n]);
        }

        return results;
    }
}]);
