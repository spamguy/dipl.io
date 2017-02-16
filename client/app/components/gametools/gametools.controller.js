angular.module('gametools.component')
.controller('GameToolsController', ['userService', 'gameService', '$mdDialog', '$state', function(userService, gameService, $mdDialog, $state) {
    var vm = this,
        confirm;

    vm.gameService = gameService;
    vm.powerOwnsUnitInProvince = powerOwnsUnitInProvince;
    vm.setPhaseState = setPhaseState;
    vm.currentUserInGame = gameService.getCurrentUserInGame(vm.service.game);
    vm.getPowerHeader = getPowerHeader;

    vm.actions = {
        quitGame: function() {
            confirm = $mdDialog.confirm()
                .title('Quit')
                .htmlContent('<p>Are you sure you want to quit this game? If you really must go, ask the GM to excuse you. Otherwise:</p><ul><li>Your rank will suffer.</li><li>Your ability to join future games may suffer.</li><li>You will be judged with extreme prejudice by many generations to come.</li></ul>')
                .ariaLabel('Quit game')
                .targetEvent(event)
                .ok('OK')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                gameService.removePlayer(userService.getCurrentUserID(), vm.service.game, true, function() {
                    $state.go('profile.games');
                });
            });
        }
    };

    function powerOwnsUnitInProvince(code, province) {
        return province.unit && province.unit.owner === code;
    }

    function setPhaseState() {
        gameService.setPhaseState(vm.service.game, vm.service.getCurrentPhase(), vm.service.phaseState);
    }

    function getPowerHeader(code, power) {
        var unitCount = document.querySelectorAll('section.section-' + code + ' md-list-item').length;
        return power.name + ' (' + unitCount + ' ' + pluralize('unit', unitCount) + ')';
    }
}]);
