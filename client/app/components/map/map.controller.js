angular.module('map.component')
.controller('MapController', ['$animate', 'gameService', 'hotkeys', '$mdBottomSheet', '$scope', '$state', 'variantService',
    function($animate, gameService, hotkeys, $mdBottomSheet, $scope, $state, variantService) {
        var vm = this,
            normalisedVariantName = variantService.getNormalisedVariantName(vm.service.game.Variant),
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

        vm.getFormattedDeadline = gameService.getFormattedDeadline;
        vm.goToOrdinal = goToOrdinal;
        vm.addToOrdinal = addToOrdinal;
        vm.buildOrders = filterBuildOrders;
        vm.inputOrder = inputOrder;
        vm.showOrderSheet = showOrderSheet;

        // PRIVATE FUNCTIONS

        function getSVGAttribute(attr) {
            return vm.svg.documentElement.getAttribute(attr);
        }

        function goToOrdinal(ordinal) {
            // Keep phase ordinal inside countable number of phases.
            if (ordinal <= 0)
                ordinal = 1;
            else if (ordinal > vm.service.phases.length)
                ordinal = null;

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
            goToState(vm.service.getCurrentPhase().Properties.PhaseOrdinal);
        }

        function bindHotkeys(hotkeys) {
            hotkeys.add({
                combo: 'h',
                description: 'Change to \'hold\' action',
                callback: function() {
                    vm.service.setCurrentAction('Hold');
                }
            });
            hotkeys.add({
                combo: 'm',
                description: 'Change to \'move\' action',
                callback: function() {
                    vm.service.setCurrentAction('Move');
                }
            });
            hotkeys.add({
                combo: 's',
                description: 'Change to \'support\' action',
                callback: function() {
                    vm.service.setCurrentAction('Support');
                }
            });
            hotkeys.add({
                combo: 'c',
                description: 'Change to \'convoy\' action',
                callback: function() {
                    vm.service.setCurrentAction('Convoy');
                }
            });
        }

        function inputOrder(id) {
            vm.service.inputOrder(id)
            .then(function(order) {
                if (!order)
                    return;
                vm.service.applyOrderLocally(order);

                // Apply/remote flash CSS.
                var provinceToAnimate = order[0].toUpperCase(),
                    el = angular.element(document.querySelector('#' + provinceToAnimate + '-order'));
                $animate.addClass(el, 'submit success')
                .then(function() {
                    el.removeClass('submit success');
                });
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
    }
])
.filter('buildOrders', function() {
    return function(orders) {
        var o = 0,
            filtered = [];

        for (; o < orders.length; o++) {
            if (orders[o].Properties.Parts[1] === 'Build')
                filtered.push(orders[o]);
        }

        return filtered;
    };
});
