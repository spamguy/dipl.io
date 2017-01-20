angular.module('map.component')
.controller('MapController', ['$animate', 'gameService', '$mdBottomSheet', '$scope', '$state', 'variantService',
function($animate, gameService, $mdBottomSheet, $scope, $state, variantService) {
    var vm = this,
        normalisedVariantName = variantService.getNormalisedVariantName(vm.service.game.Variant),
        paths = vm.svg.getElementsByTagName('path'),
        p;

    vm.paths = { };
    vm.getFormattedDeadline = gameService.getFormattedDeadline;
    vm.goToOrdinal = goToOrdinal;
    vm.addToOrdinal = addToOrdinal;

    vm.inputOrder = function(id) {
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
    };

    vm.showOrderSheet = function() {
        $mdBottomSheet.show({
            templateUrl: 'app/components/map/ordersheet/ordersheet.tmpl.html',
            controller: 'OrderSheetController',
            controllerAs: 'vm',
            clickOutsideToClose: true,
            locals: {
                service: vm.service
            }
        }).then(vm.service.setCurrentAction);
    };

    // Fill out province paths only if the vm.service.phase is active.
    if (!vm.readonly) {
        for (p = 0; p < paths.length; p++)
            vm.paths[paths[p].id.toUpperCase()] = paths[p].getAttribute('d');
    }

    vm.imagePath = 'variants/' + normalisedVariantName + '/' + normalisedVariantName + '.png';
    vm.viewBox = '0 0 ' + getSVGAttribute('width') + ' ' + getSVGAttribute('height');

    // Unstarted games have rendered all they need to.
    if (!vm.service.game.Started)
        return;

    vm.clickCount = 0;

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
}]);
