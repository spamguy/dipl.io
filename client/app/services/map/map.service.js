angular.module('mapService', ['gameService', 'userService', 'variantService'])
.service('mapService', ['gameService', '$location', 'variantService', function(gameService, $location, variantService) {
    'use strict';

    var _currentAction = 'Hold',
        _clickedProvinces = [],
        _ordinal = 1,
        _options = { },
        service = function(data) {
            var powerOfCurrentPlayer = gameService.getCurrentUserInGame(data.game),
                currentPhase,
                o = 0;

            this.variant = data.variant;
            this.game = data.game;
            this.phases = data.phases;
            this.phaseState = data.phaseState ? data.phaseState[0].Properties : null;
            this.orders = data.orders;
            _options = data.options;
            _ordinal = data.ordinal || this.phases.length;

            // Move current user to start of array for UI convenience.
            if (!data.variant || !powerOfCurrentPlayer || this.variant.Nations.indexOf(powerOfCurrentPlayer.Nation) < 0)
                return;
            powerOfCurrentPlayer = powerOfCurrentPlayer.Nation;
            _.pull(this.variant.Nations, powerOfCurrentPlayer);
            this.variant.Nations.unshift(powerOfCurrentPlayer);

            // Build commands need to create dummy units in order for them to show up as orders.
            currentPhase = this.getCurrentPhase();
            if (currentPhase && !currentPhase.Resolved && currentPhase.Type === 'Adjustment') {
                for (; o < this.orders.length; o++) {
                    if (this.orders[o].Properties.Parts[1] === 'Build') {
                        currentPhase.Units.push({
                            Province: this.orders[o].Properties.Parts[0],
                            Unit: {
                                Type: this.orders[o].Properties.Parts[2],
                                Nation: this.orders[o].Properties.Nation
                            }
                        });
                    }
                }
            }
        };

    service.prototype.getCurrentPhase = getCurrentPhase;
    service.prototype.getAllSCs = getAllSCs;
    service.prototype.getSCTransform = getSCTransform;
    service.prototype.getSCPath = getSCPath;
    service.prototype.getSCFill = getSCFill;
    service.prototype.getDisbandTransform = getDisbandTransform;
    service.prototype.generateGlow = generateGlow;
    service.prototype.generateMarkerStart = generateMarkerStart;
    service.prototype.generateMarkerEnd = generateMarkerEnd;
    service.prototype.generateLine = generateLine;
    service.prototype.generateArc = generateArc;
    service.prototype.generateBisectingLine = generateBisectingLine;
    service.prototype.generateLineIntersectingHold = generateLineIntersectingHold;
    service.prototype.setCurrentAction = setCurrentAction;
    service.prototype.getCurrentAction = getCurrentAction;
    service.prototype.isInPendingCommand = isInPendingCommand;
    service.prototype.inputOrder = inputOrder;
    service.prototype.applyOrderLocally = applyOrderLocally;
    service.prototype.getOrderForProvince = getOrderForProvince;
    service.prototype.orderDidFail = orderDidFail;
    service.prototype.orderIsDisband = orderIsDisband;
    service.prototype.userCanPerformAction = userCanPerformAction;
    service.prototype.isUserInputExpected = isUserInputExpected;
    service.prototype.addToOrdinal = addToOrdinal;

    return service;

    // PRIVATE FUNCTIONS

    function getCurrentPhase() {
        var phase = this.phases[_ordinal - 1];
        return phase ? phase.Properties : null;
    }

    function getAllSCs() {
        return _.filter(_.values(this.variant.Graph.Nodes), function(n) {
            return n.SC;
        });
    }

    function getSCPath() {
        return $location.absUrl() + '#sc';
    }

    function getSCTransform(p) {
        return 'translate(' + p.sc.x + ',' + p.sc.y + ') scale(0.04)';
    }

    function getSCFill(p) {
        var sc = _.find(this.getCurrentPhase().SCs, ['Province', p.Name]);
        return sc ? this.variant.Powers[sc.Owner[0]].colour : '#ccc';
    }

    function getDisbandTransform(p) {
        return 'translate(' + (p.x - 14) + ',' + (p.y - 14) + ') scale(1.2)';
    }

    function generateMarkerStart(d) {
        // See CSS file for why separate markers exist for failed orders.
        var failed = d.source.unit.resolution ? 'failed' : '';

        if (d.source.unit.action === 'convoy')
            return 'url(' + $location.absUrl() + '#' + failed + d.source.unit.action + ')';
        else
            return null;
    }

    function generateMarkerEnd(order) {
        // See CSS file for why separate markers exist for failed orders.
        var id = order[0],
            failed = this.orderDidFail(id) ? 'failed' : '';
        return 'url(' + $location.absUrl() + '#' + failed + order[1].toLowerCase() + ')';
    }

    function generateGlow() {
        return 'url(' + $location.absUrl() + '#new)';
    }

    /**
     * Generate a line segment with padding on both ends.
     * @param  {String} source The source province.
     * @param  {String} target The target province.
     * @return {String}    An SVG path.
     */
    function generateLine(source, target) {
        var sourceProvince = variantService.getProvinceInVariant(this.variant, source),
            targetProvince = variantService.getProvinceInVariant(this.variant, target),
            LINK_UNIT_PADDING = 16,
            dx = targetProvince.x - sourceProvince.x,
            dy = targetProvince.y - sourceProvince.y,
            dr = Math.sqrt(dx * dx + dy * dy),
            offsetX = (dx * LINK_UNIT_PADDING) / dr,
            offsetY = (dy * LINK_UNIT_PADDING) / dr;

        return 'M' + (sourceProvince.x + offsetX) + ',' +
            (sourceProvince.y + offsetY) + 'L' +
            (targetProvince.x - offsetX) + ',' +
            (targetProvince.y - offsetY);
    }

    /**
     * Generate an SVG path line with a slight arc to it.
     * @param  {String} source The source province.
     * @param  {String} target The target province.
     * @return {String}    An SVG path.
     */
    function generateArc(source, target) {
        var sourceProvince = variantService.getProvinceInVariant(this.variant, source),
            targetProvince = variantService.getProvinceInVariant(this.variant, target),
            LINK_UNIT_PADDING = 19,
            dx = targetProvince.x - sourceProvince.x,
            dy = targetProvince.y - sourceProvince.y,
            dr = Math.sqrt(dx * dx + dy * dy),
            offsetX = (dx * LINK_UNIT_PADDING) / dr,
            offsetY = (dy * LINK_UNIT_PADDING) / dr;

        return 'M' + sourceProvince.x + ',' +
            sourceProvince.y + 'A' + dr + ',' +
            dr + ' 0 0,1 ' + (targetProvince.x - offsetX) + ',' +
            (targetProvince.y - offsetY);
    }

    function generateBisectingLine(source, target, targetOfTarget) {
        /*
         * In a variety of scenarios, the action being supported may not exist.
         * Create a temporary path representing the EXPECTED action, and use coordinates from that.
         * Do not apply this temporary path to the map.
         */
        var sourceProvince = variantService.getProvinceInVariant(this.variant, source),
            theoreticalPathOfTarget = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
            pathLength,
            midpoint;

        theoreticalPathOfTarget.setAttributeNS(null, 'd', this.generateArc(target, targetOfTarget));
        pathLength = theoreticalPathOfTarget.getTotalLength();
        midpoint = theoreticalPathOfTarget.getPointAtLength(pathLength / 2);
        return 'M' + sourceProvince.x + ',' + sourceProvince.y + 'L' + midpoint.x + ',' + midpoint.y;
    }

    function generateLineIntersectingHold(source, target) {
        var sourceProvince = variantService.getProvinceInVariant(this.variant, source),
            targetProvince = variantService.getProvinceInVariant(this.variant, target),
            shiftedTargetX = targetProvince.x,
            shiftedTargetY = targetProvince.y;

        return 'M' + sourceProvince.x + ',' + sourceProvince.y + 'L' + shiftedTargetX + ',' + shiftedTargetY;
    }

    function setCurrentAction(action) {
        _currentAction = action;

        // Reset any half-made orders.
        clearPendingOrder();
    }

    function clearPendingOrder() {
        while (_clickedProvinces.length) _clickedProvinces.pop();
    }

    function inputOrder(id) {
        id = id.toLowerCase();
        var emptyOrder = Promise.resolve(null),
            order = emptyOrder,
            currentPlayerNation = gameService.getCurrentUserInGame(this.game);

        /*
         * Users who try to move units that don't exist or they don't own?
         * We have ways of shutting the whole thing down.
         * The first click in a queue indicates the unit receiving the order.
         * No unit or ownership at that click = stop. (Unless it's a build phase, in which case click = go.)
         */
        if (this.getCurrentPhase().Type === 'Movement' && !_clickedProvinces.length && !findUnitOwnedByUserAtProvince(this.getCurrentPhase().Units))
            return emptyOrder;

        // Resolved phases don't receive orders at all.
        if (this.getCurrentPhase().Resolved)
            return emptyOrder;

        _clickedProvinces.push(id);

        switch (getCurrentAction()) {
        case 'Hold':
            // Don't bother retaining clicks. Just continue on to send the command.
            order = buildDefaultOrder(_clickedProvinces.pop());
            break;
        case 'Move':
            order = buildMoveOrder(this.variant);
            break;
        case 'Support':
            order = buildSupportOrder();
            break;
        case 'Convoy':
            order = buildConvoyOrder();
            break;
        case 'Build-Army':
        case 'Build-Fleet':
            order = buildBuildOrder(_clickedProvinces.pop());
            break;
        case 'Disband':
            order = buildDisbandOrder(_clickedProvinces.pop());
            break;
        default:
            console.warn('Order type \'' + getCurrentAction() + '\' not recognised');
            break;
        }

        // No order = no action.
        if (!order)
            return emptyOrder;

        // Making it this far means there is a full set of commands to publish.
        return gameService.publishOrder(this.game, this.getCurrentPhase(), order);

        function findUnitOwnedByUserAtProvince(phaseProvinces) {
            return _.find(phaseProvinces, unitIsOwnedByPower);
        }

        function unitIsOwnedByPower(u) {
            return u.Province === id && currentPlayerNation && u.Unit.Nation === currentPlayerNation.Nation;
        }
    }

    function applyOrderLocally(order) {
        var currentPlayerNation = gameService.getCurrentUserInGame(this.game).Nation,
            currentPhase = this.getCurrentPhase();

        // Purge old order (if any) for this province before adding new one.
        this.orders = _.reject(this.orders, function(o) { return o.Properties.Parts[0] === order[0]; });
        this.orders.push({
            Properties: {
                Nation: currentPlayerNation,
                Parts: order
            }
        });

        // Tinker with unit placement if this is an adjustment phase.
        if (currentPhase.Type === 'Adjustment') {
            currentPhase.Units = _.reject(currentPhase.Units, function(u) { return u.Province === order[0]; });
            currentPhase.Units.push({
                Province: order[0],
                Unit: {
                    Type: order[2],
                    Nation: currentPlayerNation
                }
            });
        }
    }

    function getOrderForProvince(p) {
        // TODO: Index orders to cut down on looping.
        return _.find(this.orders, function(o) {
            return o.Properties.Parts[0] === p.toLowerCase();
        });
    }

    function orderIsDisband(id) {
        var order = this.getOrderForProvince(id);
        return order && order.Properties.Parts[1] === 'Disband';
    }

    function orderDidFail(id) {
        var currentPhase = this.getCurrentPhase(),
            orderResolution;

        if (currentPhase.Resolutions)
            orderResolution = _.find(currentPhase.Resolutions, ['Province', id]);

        return orderResolution && orderResolution.Resolution !== 'OK';
    }

    function userCanPerformAction(phaseType, action, unitType) {
        if (!this.game.Started || this.game.Finished)
            return false;

        var phase = this.getCurrentPhase(),
            isPlayer = gameService.isPlayer(this.game),
            actionIsPhaseAppropriate = phase.Type === phaseType,
            k,
            next,
            actionIsPermitted = false;

        // Only adjustment phases have to consider legality of builds/disbands.
        if (action) {
            for (k in _options) {
                next = _options[k].Next;
                if (next && next[action] && next[action].Next && (!unitType || next[action].Next[unitType])) {
                    actionIsPermitted = true;
                    break;
                }
            }
        }
        else {
            actionIsPermitted = true;
        }

        return phase && isPlayer && actionIsPhaseAppropriate && actionIsPermitted;
    }

    function getCurrentAction() {
        return _currentAction;
    }

    function isInPendingCommand(id) {
        return _clickedProvinces.indexOf(id.toLowerCase().replace('-', '/')) >= 0;
    }

    function isUserInputExpected() {
        return _.keys(_options).length !== 0;
    }

    function addToOrdinal(delta) {
        if (!_ordinal)
            _ordinal = this.phases.length;
        _ordinal += delta;
        if (_ordinal <= 0)
            _ordinal = 1;
        else if (_ordinal > this.phases.length)
            _ordinal = this.phases.length;
    }

    function buildDefaultOrder(id) {
        return [id, 'Hold'];
    }

    function buildMoveOrder(variant) {
        // Source -> target.
        if (_clickedProvinces.length < 2)
            return null;

        var source = _clickedProvinces.shift(),
            sourceComponents = source.split('/'),
            target = _clickedProvinces.shift(),
            sourceProvince = variantService.getProvinceInVariant(variant, sourceComponents[0]),
            subprovince = sourceComponents[1] || '';

        // Source can't move to itself. Treat as hold.
        if (sourceComponents[0] === target)
            return buildDefaultOrder(source);

        // Discern between Move and MoveViaConvoy by examining graph edges.
        if (!sourceProvince.Subs[subprovince].Edges[target])
            return [source, 'MoveViaConvoy', target];

        return [source, 'Move', target];
    }

    function buildSupportOrder() {
        // Source -> target -> target of target.
        if (_clickedProvinces.length < 3)
            return null;

        var source = _clickedProvinces.shift(),
            target = _clickedProvinces.shift(),
            targetOfTarget = _clickedProvinces.shift();

        // Source can't support itself. Treat as hold.
        if (source === target)
            return buildDefaultOrder(source);

        return [source, 'Support', target, targetOfTarget];
    }

    function buildConvoyOrder() {
        // Source -> target -> target of target.
        if (_clickedProvinces.length < 3)
            return;

        var source = _clickedProvinces.shift(),
            target = _clickedProvinces.shift(),
            targetOfTarget = _clickedProvinces.shift();

        /*
         * Don't convoy the convoyer.
         * Don't convoy into the convoyer.
         * Don't let the start equal the finish.
         * In short, source/target/target of target should be distinct.
         * Treat violations of the above as a hold.
         */
        if (_clickedProvinces.length !== _.uniq(_clickedProvinces).length)
            return buildDefaultOrder(source);

        return [source, 'Convoy', target, targetOfTarget];
    }

    function buildBuildOrder(province) {
        var buildParts = getCurrentAction().split('-');
        return [province, 'Build', buildParts[1]];
    }

    function buildDisbandOrder(id) {
        return [id, 'Disband'];
    }
}]);
