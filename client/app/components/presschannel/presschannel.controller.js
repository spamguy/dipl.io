angular.module('gametools.component')
.controller('PressChannelController', ['gameService', function(gameService) {
    var vm = this,
        currentPlayerNation;

    if (!vm.game || !vm.variant)
        return;

    currentPlayerNation = gameService.getCurrentUserInGame(vm.game).Nation;

    // Hydrate nation initials into full names.
    vm.members = _.map(vm.members.split(''), function(m) {
        return _.find(vm.variant.Nations, function(n) {
            return m === n[0];
        });
    });

    // List must contain player.
    if (vm.members.indexOf(currentPlayerNation) === -1)
        vm.members.unshift(currentPlayerNation);
}]);
