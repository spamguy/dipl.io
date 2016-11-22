/* global humanizeDuration */
angular.module('gamelistitem.directive', ['ngMaterial'])
.directive('sgGameListItem', ['userService', 'gameService', '$mdDialog', '$mdPanel', '$state', function(userService, gameService, $mdDialog, $mdPanel, $state) {
    'use strict';

    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'app/directives/gamelistitem/gamelistitem.tmpl.html',
        scope: {
            game: '=game',
            joinable: '=joinable'
        },
        link: function(scope, element, attrs) {
            var vm = this,
                timeUntilDeadline,
                currentPhase;
            gameService.getPhases(scope.game.ID)
            .then(function(phases) {
                scope.phases = phases.Properties;
                currentPhase = _.last(scope.phases);
            });

            vm.reasonForNoJoin = reasonForNoJoin;
            vm.showJoinDialog = showJoinDialog;
            vm.goToGame = goToGame;
            vm.showDetailsDialog = showDetailsDialog;

            if (!scope.game.Started) {
                // TODO: Replace 0 with variant player count.
                scope.phaseDescription = '(Not started: waiting on ' + (0 - scope.game.Members.length) + ' more players)';
            }
            else if (scope.game.Started && currentPhase) {
                timeUntilDeadline = new Date(currentPhase.DeadlineAt).getTime() - new Date().getTime();
                scope.phaseDescription = currentPhase.Season + ' ' + currentPhase.Year;
                scope.readableTimer = humanizeDuration(timeUntilDeadline, { largest: 2, round: true });
            }
            else if (scope.game.Finished) {
                scope.phaseDescription = 'Complete';
                scope.readableTimer = 'Complete';
            }
        }
    };

    // PRIVATE FUNCTIONS

    function reasonForNoJoin(game) {
        // Breaking this down into individual rules to avoid one monstrous if() statement.

        // User belongs to game already, whether as GM or user.
        if (gameService.isPlayer(game))
            return 'You already are a player in this game.';
        if (gameService.isGM(game))
            return 'You GM this game.';

        return null;
    }

    function goToGame(game) {
        $state.go('games.view', { id: game.ID });
    }

    function showJoinDialog(game, event) {
        var confirm = $mdDialog.confirm()
                        .title('Really join?')
                        .textContent('Are you sure you want to join this game? By clicking OK you are agreeing to participate to the best of your ability. See the FAQ and Community Guidelines for details.')
                        .ariaLabel('Really join game?')
                        .targetEvent(event)
                        .ok('Join')
                        .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            gameService.joinGame(game, { }, function() {
                $state.go('profile.games');
            });
        });
    }

    function showDetailsDialog(game) {
        var position = $mdPanel.newPanelPosition().absolute().center(),
            config = {
                attachTo: angular.element(document.body),
                controller: GameListItemDetailsController,
                controllerAs: 'vm',
                disableParentScroll: true,
                templateUrl: 'app/directives/gamelistitem/gamelistitemdetails.tmpl.html',
                position: position
            };

        $mdPanel.open(config);
    }
}])
.controller('GameListItemDetailsController', GameListItemDetailsController);

function GameListItemDetailsController() {

}
