'use strict';

angular.module('games')
.controller('ViewController', ['game', 'gameService', 'mapService', '$mdDialog', 'options', 'orders', 'phases', 'phaseState', '$state', '$stateParams', 'svg', 'userService', 'variant',
    function(game, gameService, MapService, $mdDialog, options, orders, phases, phaseState, $state, $stateParams, svg, userService, variant) {
        game = game.Properties;
        phases = phases.Properties;
        orders = orders ? orders.Properties : null;
        phaseState = phaseState ? phaseState.Properties : null;
        options = options ? options.Properties : null;
        var vm = this;

        vm.currentUserInGame = gameService.getCurrentUserInGame(game);
        vm.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
        vm.service = new MapService(variant, game, phases, orders, phaseState, options, $stateParams.ordinal);

        // When the ordinal changes, get new data corresponding to the phase.
        this.uiOnParamsChanged = function(params) {
            Promise.all([
                gameService.getPhaseState(vm.service.game.ID, vm.service.getCurrentPhase().Properties),
                gameService.getPhaseOrders(vm.service.game.ID, vm.service.getCurrentPhase().Properties)
            ])
            .spread(function(state, orders) {
                vm.service.currentState = state.Properties;
                vm.service.orders = orders.Properties;
            });
        };

        // Point out games that haven't started yet.
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
