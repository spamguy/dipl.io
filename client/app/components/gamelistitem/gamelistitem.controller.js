angular.module('gamelistitem.component')
.controller('GameListItemController', ['gameService', 'mapService', '$mdDialog', '$mdPanel', '$state', 'variantService',
    function(gameService, MapService, $mdDialog, $mdPanel, $state, variantService) {
        var vm = this;

        vm.$onInit = function() {
            vm.service = gameService;
            vm.goToGame = goToGame;
            vm.showDetailsDialog = showDetailsDialog;

            // Fetch remaining data.
            Promise.all([
                variantService.getVariant(vm.game.Variant),
                gameService.getPhases(vm.game.ID)
            ])
            .spread(function(variant, phases) {
                // Do not use a MapService, no matter how reasonable that sounds. See below.
                vm.phases = phases;
                var currentPhase = _.last(vm.phases);

                if (currentPhase)
                    currentPhase = currentPhase.Properties;
                return Promise.all([
                    Promise.resolve(variant),
                    Promise.resolve(currentPhase),
                    gameService.getPhaseState(vm.game, currentPhase),
                    gameService.getPhaseOrders(vm.game.ID, currentPhase)
                ])
                .spread(applyData);
            });
        };

        // PRIVATE FUNCTIONS

        /*
         * A MapService would be great here, but as a singleton, it would produce odd results
         * when shared between multiple list items.
         */
        function applyData(variant, currentPhase, phaseState, orders) {
            vm.currentPhase = currentPhase;
            vm.phaseState = phaseState;
            vm.orders = orders;
            vm.variant = variant;
        }

        function goToGame() {
            $state.go('games.view', { id: vm.game.ID });
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
                    service: new MapService({
                        variant: vm.variant,
                        game: vm.game,
                        phases: vm.phases,
                        orders: vm.orders,
                        phaseState: vm.currentState
                    }),
                    joinable: vm.joinable,
                    svg: variantService.getVariantSVG(vm.game.Variant),
                    status: vm.phaseDescription
                }
            });
        }
    }
]);
