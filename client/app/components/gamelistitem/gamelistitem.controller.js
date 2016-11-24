/* global humanizeDuration */
angular.module('gamelistitem.component')
.controller('GameListItemController', ['userService', 'gameService', '$mdDialog', '$mdPanel', '$state',
function(userService, gameService, $mdDialog, $mdPanel, $state) {
    var vm = this,
        timeUntilDeadline,
        currentPhase;
    gameService.getPhases(vm.game.ID)
    .then(function(phases) {
        vm.phases = phases.Properties;
        currentPhase = _.last(vm.phases);
    });

    vm.reasonForNoJoin = reasonForNoJoin;
    vm.showJoinDialog = showJoinDialog;
    vm.goToGame = goToGame;
    vm.showDetailsDialog = showDetailsDialog;

    if (!vm.game.Started) {
        // TODO: Replace 0 with variant player count.
        vm.phaseDescription = '(Not started: waiting on ' + (0 - vm.game.Members.length) + ' more players)';
    }
    else if (vm.game.Started && currentPhase) {
        timeUntilDeadline = new Date(currentPhase.DeadlineAt).getTime() - new Date().getTime();
        vm.phaseDescription = currentPhase.Season + ' ' + currentPhase.Year;
        vm.readableTimer = humanizeDuration(timeUntilDeadline, { largest: 2, round: true });
    }
    else if (vm.game.Finished) {
        vm.phaseDescription = 'Finished';
        vm.readableTimer = 'Finished';
    }

    // PRIVATE FUNCTIONS

    function reasonForNoJoin() {
        // Breaking this down into individual rules to avoid one monstrous if() statement.

        // User belongs to game already, whether as GM or user.
        if (gameService.isPlayer(vm.game))
            return 'You already are a player in this game.';
        if (gameService.isGM(vm.game))
            return 'You GM this game.';

        return null;
    }

    function goToGame() {
        $state.go('games.view', { id: vm.game.ID });
    }

    function showJoinDialog(event) {
        var confirm = $mdDialog.confirm()
                        .title('Really join?')
                        .textContent('Are you sure you want to join this game? By clicking OK you are agreeing to participate to the best of your ability. See the FAQ and Community Guidelines for details.')
                        .ariaLabel('Really join game?')
                        .targetEvent(event)
                        .ok('Join')
                        .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            gameService.joinGame(vm.game, { }, function() {
                $state.go('profile.games');
            });
        });
    }

    function showDetailsDialog(event) {
        $mdDialog.show({
            controller: 'GameListItemDetailsController as dg',
            scope: vm,
            templateUrl: 'app/components/gamelistitem/gamelistitemdetails.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: false
        });
    }
}]);
