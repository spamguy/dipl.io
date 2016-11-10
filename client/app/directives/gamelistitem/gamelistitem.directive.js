/* global humanizeDuration */
angular.module('gamelistitem.directive', ['ngMaterial'])
.directive('sgGameListItem', ['userService', 'gameService', '$mdDialog', '$mdMedia', '$state', function(userService, gameService, $mdDialog, $mdMedia, $state) {
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
            var timeUntilDeadline;
            gameService.getPhase(scope.game.id, null)
            .then(function(phase) {
                scope.phase = phase;
            });

            scope.reasonForNoJoin = function() {
                // Breaking this down into individual rules to avoid one monstrous if() statement.

                // User doesn't have enough points.
                if (scope.game.minimumDedication > scope.$root.$storage.theUser.actionCount)
                    return 'You need a minimum reliability of ' + scope.game.minimumDedication + ' to join.';

                // User belongs to game already, whether as GM or user.
                if (gameService.isPlayer(scope.game))
                    return 'You already are a player in this game.';
                if (gameService.isGM(scope.game))
                    return 'You GM this game.';

                return null;
            };

            scope.goToGame = function() {
                $state.go('games.view', { id: scope.game.id });
            };

            scope.showJoinDialog = function(event) {
                var confirm = $mdDialog.confirm()
                                .title('Really join?')
                                .textContent('Are you sure you want to join this game? By clicking OK you are agreeing to participate to the best of your ability. See the FAQ and Community Guidelines for details.')
                                .ariaLabel('Really join game?')
                                .targetEvent(event)
                                .ok('Join')
                                .cancel('Cancel');

                $mdDialog.show(confirm).then(function() {
                    gameService.joinGame(scope.game, { }, function() {
                        $state.go('profile.games');
                    });
                });
            };

            scope.showMapDialog = function($event) {
                var useFullScreen = $mdMedia('sm') || $mdMedia('xs');

                gameService.getMoveData(scope.game.id).then(function(phase) {
                    gameService.getVariant(scope.game.variant).then(function(variant) {
                        gameService.getVariantSVG(scope.game.variant).then(function(svg) {
                            $mdDialog.show({
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                fullscreen: useFullScreen,
                                templateUrl: 'app/directives/gamelistitem/gamelistitemmap.tmpl.html',
                                controller: 'GameListItemMapController',
                                clickOutsideToClose: true,
                                locals: {
                                    phase: phase,
                                    variant: variant,
                                    game: scope.game,
                                    svg: svg
                                }
                            });
                        });
                    });
                });
            };

            // gameService.getMoveData(scope.game.id).then(function(phase) {
            switch (scope.game.status) {
            case 0:
                scope.phaseDescription = '(waiting on ' + (scope.game.maxPlayers - scope.game.players.length) + ' more players)';
                scope.readableTimer = humanizeDuration(scope.game.moveClock * 60 * 60 * 1000) + ' deadline';
                break;
            case 1:
                if (scope.phase) {
                    timeUntilDeadline = new Date(scope.phase.deadline).getTime() - new Date().getTime();
                    scope.phaseDescription = scope.phase.season + ' ' + scope.phase.year;
                    scope.readableTimer = humanizeDuration(timeUntilDeadline, { largest: 2, round: true });
                }
                break;
            case 2:
                scope.phaseDescription = 'Complete';
                scope.readableTimer = 'Complete';
                break;
            }
            // });
        }
    };
}])
.controller('GameListItemMapController', ['$scope', '$mdDialog', 'phase', 'variant', 'game', 'svg', function($scope, $mdDialog, phase, variant, game, svg) {
    $scope.phase = phase;
    $scope.variant = variant;
    $scope.game = game;
    $scope.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
}]);
