angular.module('gametools.component')
.controller('GameToolsController', ['userService', 'gameService', '$mdDialog', '$state', function(userService, gameService, $mdDialog, $state) {
    var vm = this,
        confirm;

    vm.gameService = gameService;
    vm.powerOwnsUnitInProvince = powerOwnsUnitInProvince;
    vm.getPowerList = getPowerList;
    vm.setReadyState = setReadyState;
    vm.currentUserInGame = gameService.getCurrentUserInGame(vm.service.game);
    vm.getPowerHeader = getPowerHeader;

    vm.actions = {
        adjudicateNow: function() {
            confirm = $mdDialog.confirm()
                .title('Adjudicate')
                .textContent('Are you sure you want to adjudicate the current phase?')
                .ariaLabel('Adjudicate now?')
                .targetEvent(event)
                .ok('OK')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                gameService.adjudicateCurrentPhase(vm.service.game, function() {
                    $state.go('profile.games');
                });
            });
        },
        endGame: function() {
            confirm = $mdDialog.confirm()
                .title('Abort')
                .htmlContent('<p>Are you sure you want to abort this game?</p><ul><li>Players will not receive credit.</li><li>You run the risk of being scorned by your peers.</li></ul>')
                .ariaLabel('Abort game')
                .targetEvent(event)
                .ok('OK')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                gameService.endGame(vm.service.game, function() {
                    $state.go('profile.games');
                });
            });
        },
        excusePlayer: function() {
            // TODO: Allow excusing players without penalty.
            // Use custom dialog providing list of powers (not players).
        },
        bootPlayer: function() {
            // TODO: Allow booting players with penalty.
            // Use custom dialog providing list of powers (not players).
        },
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

    function getPowerList() {
        var powersWithoutGM = vm.powers;
        delete powersWithoutGM.GM;
        return powersWithoutGM;
    }

    function setReadyState() {
        gameService.setReadyState(vm.service.game, gameService.getCurrentUserInGame(vm.service.game).isReady);
    }

    function getPowerHeader(code, power) {
        var unitCount = document.querySelectorAll('section.section-' + code + ' md-list-item').length;
        return power.name + ' (' + unitCount + ' ' + pluralize('unit', unitCount) + ')';
    }
}]);
