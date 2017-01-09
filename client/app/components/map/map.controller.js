angular.module('map.component')
.controller('MapController', ['gameService', '$mdBottomSheet', '$scope', '$state', 'variantService', function(gameService, $mdBottomSheet, $scope, $state, variantService) {
    var vm = this,
        normalisedVariantName = variantService.getNormalisedVariantName(vm.service.game.Variant),
        paths = vm.svg.getElementsByTagName('path'),
        p,
        i,
        moveLayer = d3.select('svg g.moveLayer'),
        moveLayerArrows = moveLayer.selectAll('path'),
        moveLayerHolds = moveLayer.selectAll('circle'),
        force,
        // unitDictionary = _.keyBy(vm.service.getCurrentPhase().Properties.Units, function(u) { return u.Province.toUpperCase(); }),
        links = [],
        holds = [],
        unitRadiusPlusPadding = 16;

    vm._ = _; // Expose lodash to Angular template.
    vm.paths = { };
    vm.getFormattedDeadline = gameService.getFormattedDeadline;
    vm.goToOrdinal = goToOrdinal;
    vm.addToOrdinal = addToOrdinal;

    vm.inputOrder = function(id) {
        vm.service.inputOrder(id)
        .then(function() {
            vm.service.applyOrderLocally();
            renderForceDirectedGraph();
        });
    };

    $scope.$on('renderphase', function(event) {
        renderForceDirectedGraph();
    });

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

    force = d3.layout.force()
        .nodes(vm.service.getCurrentPhase().Properties.Units)
        .links(links)
        .on('tick', onForceDirectedGraphTick.bind(this)); // bind() forces function's scope to controller.

    renderForceDirectedGraph();

    function onForceDirectedGraphTick(e, scope) {
        moveLayerArrows.attr('d', function(d) {
            /*
             * Let T -> target, T' -> target of target, and S -> source.
             *
             * The endpoint of this path depends on a) what S intends to do, and b) what T intends to do.
             * If S intends to complement T, and if T' exists, the endpoint should exist somewhere on the T - T' path to indicate the support.
             * In all other cases T as an endpoint is fine.
             */

            var sourceProvince = vm.service.phase.provinces[d.source.p],
                targetProvince = vm.service.phase.provinces[d.source.unit.target],
                sx = sourceProvince.unitLocation.x,
                sy = sourceProvince.unitLocation.y,
                tx = targetProvince.unitLocation.x,
                ty = targetProvince.unitLocation.y,
                action = d.target.action,
                actionOfTarget = targetProvince.unit ? targetProvince.unit.action : null;

            switch (action) {
            case 'move':
                return vm.service.generateArc(sx, sy, tx, ty);
            case 'support':
                if (actionOfTarget === 'move' || actionOfTarget === 'convoy') // Get the targeted path and draw a line pointing to the middle.
                    return vm.service.generateBisectingLine(d.target.p, targetProvince.unit.target, sx, sy);
                else // Support a holding unit with a plain ol' line.
                    return vm.service.generateArc(sx, sy, tx, ty);
            case 'convoy':
                return vm.service.generateLine(sx, sy, tx, ty);
            }
        });
    }

    /**
     * Builds force directed graph.
     */
    function renderForceDirectedGraph() {
        var // target,
            // province,
            o,
            order,
            action;

        // Reset link list and regenerate holding unit list.
        links = [];
        holds = [];

        for (o = 0; o < vm.service.orders.length; o++) {
            order = vm.service.orders[o].Properties;
            action = order.Parts[1];

            if (action === 'Hold') {
                holds.push(order.Parts[0].toUpperCase());
            }
            else {
        //         target = province.unit.target;
        //         links.push({
        //             source: _.defaults(province, { fixed: true }),
        //             target: _.assignIn({ }, vm.service.phase.provinces[target], {
        //                 fixed: true, // To keep d3 from treating this map like a true force graph.
        //                 action: province.unit.action,
        //                 resolution: province.unit.resolution
        //             })
        //         });
            }
        //
        //     // Convoys get an extra link to convey conveyance.
        //     if (province.unit.action === 'convoy') {
        //         links.push({
        //             source: _.defaults(province, { fixed: true }),
        //             target: _.assignIn({ }, vm.service.phase.provinces[province.unit.targetOfTarget], {
        //                 fixed: true, // To keep d3 from treating this map like a true force graph.
        //                 action: province.unit.action,
        //                 resolution: province.unit.resolution
        //             })
        //         });
        //     }
        }
        //
        // moveLayerArrows = moveLayerArrows.data(links);
        // moveLayerArrows.enter()
        //     .insert('svg:path')
        //     .attr('marker-start', vm.service.generateMarkerStart)
        //     .attr('marker-end', vm.service.generateMarkerEnd)
        //     .attr('class', function(d) {
        //         var failed = d.target.resolution ? 'failed ' : 'ok ';
        //         return failed + 'link ' + d.target.action;
        //     })
        //     .attr('id', function(d) { return d.source.p + '-' + d.target.p + '-link'; });
        // moveLayerArrows.exit().remove();
        //
        // Append circles to units perceived to or actually holding.
        moveLayerHolds = moveLayerHolds.data(holds);
        moveLayerHolds.enter()
            .insert('svg:circle')
            .attr('id', function(d) { return d + '-hold'; })
            .attr('class', 'hold')
            .attr('cx', function(d) {
                return vm.service.variant.Graph.Nodes[d].x;
            })
            .attr('cy', function(d) {
                return vm.service.variant.Graph.Nodes[d].y;
            })
            .attr('r', unitRadiusPlusPadding);
        moveLayerHolds.exit().remove();

        force.start();
        for (i = 20; i > 0; --i) force.tick();
        force.stop();
    }

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
