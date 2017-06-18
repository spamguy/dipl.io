angular.module('map.component')
.controller('MapController', ['$animate', 'gameService', 'hotkeys', '$mdBottomSheet', '$mdToast', '$state', 'variantService',
    function($animate, gameService, hotkeys, $mdBottomSheet, $mdToast, $state, variantService) {
        var vm = this;

        vm.$onInit = function() {
            vm.getReadableDeadline = gameService.getReadableDeadline;
            vm.goToOrdinal = goToOrdinal;
            vm.addToOrdinal = addToOrdinal;
            vm.buildOrders = filterBuildOrders;
            vm.inputOrder = inputOrder;
            vm.showOrderSheet = showOrderSheet;

            var normalisedVariantName = variantService.getNormalisedVariantName(vm.service.game.Variant),
                paths = vm.svg.getElementsByTagName('path'),
                p;

            // Fill out province paths only if the vm.service.phase is active.
            vm.paths = { };
            if (!vm.readonly) {
                for (p = 0; p < paths.length; p++)
                    vm.paths[paths[p].id.toUpperCase()] = paths[p].getAttribute('d');
            }

            vm.imagePath = 'variants/' + normalisedVariantName + '/' + normalisedVariantName + '.png';
            vm.viewBox = '0 0 ' + getSVGAttribute('width') + ' ' + getSVGAttribute('height');

            hotkeys = bindHotkeys(hotkeys);
        };

        // PRIVATE FUNCTIONS

        function getSVGAttribute(attr) {
            return vm.svg.documentElement.getAttribute(attr);
        }

        function goToOrdinal(ordinal) {
            // Keep phase ordinal inside countable number of phases.
            if (ordinal) {
                if (ordinal <= 0)
                    ordinal = 1;
                else if (ordinal > vm.service.phases.length)
                    ordinal = null;
            }

            goToState(ordinal);
        }

        function goToState(ordinal) {
            $state.go('.', {
                id: vm.service.game.ID,
                ordinal: ordinal
            }, { notify: false });
        }

        function addToOrdinal(delta) {
            vm.service.addToOrdinal(delta);
            goToState(vm.service.getCurrentPhase().PhaseOrdinal);
        }

        function bindHotkeys(hotkeys) {
            var i = 0,
                availableActions = vm.service.getAvailableActions();

            for (; i < availableActions.length; i++) {
                hotkeys.add({
                    combo: availableActions[i].key, // First char in label.
                    description: 'Change to \'' + availableActions[i].label.toLowerCase() + '\' action',
                    callback: hotkeyCallback(i)
                });
            }
        }

        function inputOrder(id) {
            // Replace dashes with slashes.
            var idWithSlashes = id.replace('-', '/');
            vm.service.inputOrder(idWithSlashes)
            .then(function(order) {
                if (!order)
                    return;
                vm.service.applyOrderLocally(order);

                // Apply/remote flash CSS.
                var provinceToAnimate = id.toUpperCase(),
                    el = angular.element(document.querySelector('#' + provinceToAnimate + '-order'));
                $animate.addClass(el, 'submit success')
                .then(function() {
                    el.removeClass('submit success');
                });
            })
            .catch(function(ex) {
                return $mdToast.show(
                    $mdToast.simple()
                    .textContent(id.toUpperCase() + ' order failed: ' + processOrderError(ex.data || ex.message))
                    .hideDelay(3000)
                    .parent(document.querySelector('#mapContainer'))
                );
            });
        }

        function showOrderSheet() {
            $mdBottomSheet.show({
                templateUrl: 'app/components/map/ordersheet/ordersheet.tmpl.html',
                controller: 'OrderSheetController',
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    service: vm.service
                }
            }).then(vm.service.setCurrentAction);
        }

        function filterBuildOrders(order) {
            return order.Properties.Parts[1] === 'Build';
        }

        function processOrderError(error) {
            error = error.match(/[^"^\v]+/)[0];
            switch (error) {
            case 'ErrIllegalConvoyPath': return 'The convoy is invalid.';
            case 'ErrMissignConvoyPath': return 'The unit can\'t reach that province.';
            case 'ErrMissingSupportUnit': return 'No unit to support at that province.';
            case 'ErrMissingSupplyCenter': return 'You can only build on supply centres.';
            default: return error;
            }
        }

        function hotkeyCallback(i) {
            return function() { vm.service.setCurrentAction(i); };
        }
    }
])
.filter('buildOrders', function() {
    return function(orders) {
        var o = 0,
            filtered = [];

        if (!orders)
            return filtered;

        for (; o < orders.length; o++) {
            if (orders[o].Properties.Parts[1] === 'Build')
                filtered.push(orders[o]);
        }

        return filtered;
    };
});
