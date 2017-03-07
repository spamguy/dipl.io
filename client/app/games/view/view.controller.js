'use strict';

angular.module('games')
.controller('ViewController', ['game', 'gameService', 'mapService', '$mdDialog', 'options', 'orders', 'phases', 'phaseState', '$state', '$stateParams', 'svg', 'userService', 'variant',
    function(game, gameService, MapService, $mdDialog, options, orders, phases, phaseState, $state, $stateParams, svg, userService, variant) {
        var vm = this;

        vm.currentUserInGame = gameService.getCurrentUserInGame(game);
        vm.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
        vm.service = new MapService({
            variant: variant,
            game: game,
            phases: phases,
            orders: orders,
            phaseState: phaseState,
            options: options.plain(),
            ordinal: $stateParams.ordinal
        });

        // When the ordinal changes, get new data corresponding to the phase.
        this.uiOnParamsChanged = function(params) {
            Promise.all([
                gameService.getPhaseState(vm.service.game.ID, vm.service.getCurrentPhase()),
                gameService.getPhaseOrders(vm.service.game.ID, vm.service.getCurrentPhase())
            ])
            .spread(function(state, orders) {
                vm.service.currentState = state;
                vm.service.orders = orders;
            });
        };

        // Point out games that haven't started yet.
        // TODO: Popups are annoying. Convert to toasts.
        if (!game.Started) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Not started')
                .ok('OK')
                .textContent('This game has not started yet. No powers have been assigned.')
                .ariaLabel('Game not started')
            );
        }
        else if (game.Finished) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Game finished')
                .ok('OK')
                .textContent('This game has already finished. No further orders are being accepted for this game.')
                .ariaLabel('Game finished')
            );
        }
    }
]);
