angular.module('gamelistitem.component')
.controller('GameListItemController', ['gameService', 'mapService', '$mdDialog', '$mdPanel', '$state', 'variantService',
    function(gameService, MapService, $mdDialog, $mdPanel, $state, variantService) {
        this.game = this.game.Properties;
        var vm = this;

        vm.reasonForNoJoin = reasonForNoJoin;
        vm.getStatusDescription = getStatusDescription;
        vm.showJoinDialog = showJoinDialog;
        vm.goToGame = goToGame;
        vm.showDetailsDialog = showDetailsDialog;

        // Fetch remaining data.
        Promise.all([
            variantService.getVariant(vm.game.Variant),
            gameService.getPhases(vm.game.ID)
        ])
        .spread(function(variant, phases) {
            vm.phases = phases.Properties;
            var currentPhase = _.last(vm.phases);

            if (currentPhase)
                currentPhase = currentPhase.Properties;
            return Promise.all([
                Promise.resolve(variant),
                Promise.resolve(currentPhase),
                gameService.getPhaseState(vm.game.ID, currentPhase),
                gameService.getPhaseOrders(vm.game.ID, currentPhase)
            ])
            .spread(applyData);
        });

        // PRIVATE FUNCTIONS

        /*
         * A MapService would be great here, but as a singleton, it would produce odd results
         * when shared between multiple list items.
         */
        function applyData(variant, currentPhase, phaseState, orders) {
            vm.currentPhase = currentPhase;
            vm.phaseState = phaseState ? phaseState.Properties : null;
            vm.orders = orders ? orders.Properties : null;
            vm.variant = variant;
        }

        function getStatusDescription() {
            var playersNeeded;

            if (!vm.game.Finished) {
                if (!vm.game.Started && vm.variant) {
                    playersNeeded = vm.variant.Nations.length - vm.game.Members.length;
                    return 'Not started: waiting on ' + playersNeeded + ' more ' + pluralize('player', playersNeeded);
                }
                else if (vm.game.Started && vm.currentPhase) {
                    return vm.currentPhase.Season + ' ' + vm.currentPhase.Type + ' ' + vm.currentPhase.Year;
                }
            }
            else {
                return 'Finished';
            }
        }

        function reasonForNoJoin() {
            // Breaking this down into individual rules to avoid one monstrous if() statement.

            // User belongs to game already, whether as GM or user.
            if (gameService.isPlayer(vm.game))
                return 'You already are a player in this game.';

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

            $mdDialog.show(confirm)
            .then(function() {
                return gameService.joinGame(vm.game, { });
            })
            .then(function() {
                return $state.go('profile.games');
            });
        }

        function showDetailsDialog(event) {
            $mdDialog.show({
                controller: 'GameListItemDetailsController',
                controllerAs: 'dg',
                templateUrl: 'app/components/gamelistitem/gamelistitemdetails.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {
                    service: new MapService(vm.variant, vm.game, vm.phases, vm.orders, vm.currentState),
                    svg: variantService.getVariantSVG(vm.game.Variant),
                    status: vm.phaseDescription
                }
            });
        }
    }
]);
