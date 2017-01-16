/* global humanizeDuration */
angular.module('mapService', ['gameService', 'variantService'])
.service('mapService', ['gameService', '$location', 'variantService', function(gameService, $location, variantService) {
    'use strict';

    var _currentAction = 'Hold',
        _clickedProvinces = [],
        _ordinal = 1,
        service = function(variant, game, phases, orders, currentState, ordinal) {
            this.variant = variant;
            this.game = game;
            this.phases = phases;
            this.currentState = currentState;
            this.orders = orders;
            _ordinal = ordinal || this.phases.length;
        };

    service.prototype.getCurrentPhase = getCurrentPhase;
    service.prototype.getStatusDescription = getStatusDescription;
    service.prototype.getReadableDeadline = getReadableDeadline;
    service.prototype.getSCTransform = getSCTransform;
    service.prototype.getSCPath = getSCPath;
    service.prototype.getSCFill = getSCFill;
    service.prototype.generateMarkerStart = generateMarkerStart;
    service.prototype.generateMarkerEnd = generateMarkerEnd;
    service.prototype.generateLine = generateLine;
    service.prototype.generateArc = generateArc;
    service.prototype.generateBisectingLine = generateBisectingLine;
    service.prototype.setCurrentAction = setCurrentAction;
    service.prototype.getCurrentAction = getCurrentAction;
    service.prototype.inputOrder = inputOrder;
    service.prototype.applyOrderLocally = applyOrderLocally;
    service.prototype.userCanPerformAction = userCanPerformAction;
    service.prototype.retreatExpected = retreatExpected;
    service.prototype.adjustExpected = adjustExpected;
    service.prototype.addToOrdinal = addToOrdinal;

    return service;

    // PRIVATE FUNCTIONS

    function getCurrentPhase() {
        if (_ordinal)
            return this.phases[_ordinal - 1];
        return _.last(this.phases);
    }

    function getSCTransform(p) {
        return 'translate(' + p.sc.x + ',' + p.sc.y + ') scale(0.04)';
    }

    function getSCFill(p) {
        var sc = _.find(this.getCurrentPhase().Properties.SCs, ['Province', p.Name]);
        return sc ? this.variant.Powers[sc.Owner[0]].colour : '#ccc';
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
        // TODO: Consider failure in generating marker end.
        var failed = !order ? 'failed' : '';
        return 'url(' + $location.absUrl() + '#' + failed + order[1].toLowerCase() + ')';
    }

    /**
     * Generate a line segment with padding on both ends.
     * @param  {Number} sx The source unit's x coordinate.
     * @param  {Number} sy The source unit's y coordinate.
     * @param  {Number} tx The target unit's x coordinate.
     * @param  {Number} ty The target unit's y coordinate.
     * @return {String}    An SVG path.
     */
    function generateLine(sx, sy, tx, ty) {
        var LINK_UNIT_PADDING = 16,
            dx = tx - sx,
            dy = ty - sy,
            dr = Math.sqrt(dx * dx + dy * dy),
            offsetX = (dx * LINK_UNIT_PADDING) / dr,
            offsetY = (dy * LINK_UNIT_PADDING) / dr;

        return 'M' + (sx + offsetX) + ',' + (sy + offsetY) + 'L' + (tx - offsetX) + ',' + (ty - offsetY);
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
            LINK_UNIT_PADDING = 20,
            dx = targetProvince.x - sourceProvince.x,
            dy = targetProvince.y - sourceProvince.y,
            dr = Math.sqrt(dx * dx + dy * dy),
            offsetX = (dx * LINK_UNIT_PADDING) / dr,
            offsetY = (dy * LINK_UNIT_PADDING) / dr;

        return 'M' + sourceProvince.x + ',' + sourceProvince.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + (targetProvince.x - offsetX) + ',' + (targetProvince.y - offsetY);
    }

    function generateBisectingLine(target, targetOfTarget, sx, sy) {
        var pathOfTarget = d3.selectAll('g.moveLayer path#' + target + '-' + targetOfTarget + '-link').node(),
            pathLength = pathOfTarget.getTotalLength(),
            midpoint = pathOfTarget.getPointAtLength(pathLength / 2);

        return 'M' + sx + ',' + sy + 'L' + midpoint.x + ',' + midpoint.y;
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
        var order,
            currentPlayerNation = gameService.getCurrentUserInGame(this.game);

        /*
         * Users who try to control units that don't exist or don't own?
         * We have ways of shutting the whole thing down.
         * The first click in a queue indicates the unit receiving the order.
         * No unit or ownership at that click = stop.
         */
        if (!_clickedProvinces.length && !findUnitOwnedByUserAtProvince(this.getCurrentPhase().Properties.Units))
            return Promise.resolve(null);

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
        case 'Build':
            order = buildBuildOrder();
            break;
        case 'Disband':
            order = buildDisbandOrder();
            break;
        default:
            console.warn('Order type \'' + getCurrentAction() + '\' not recognised');
            break;
        }

        // No order = no action.
        if (!order)
            return Promise.resolve(null);

        // Making it this far means there is a full set of commands to publish.
        return gameService.publishOrder(this.game, this.getCurrentPhase(), order)
        .catch(function(ex) {
            console.warn('Order submit ' + JSON.stringify(ex.config.data.Parts) + ' failed');
            return null;
        });

        function findUnitOwnedByUserAtProvince(phaseProvinces) {
            return _.find(phaseProvinces, unitIsOwnedByPower);
        }

        function unitIsOwnedByPower(u) {
            return u.Province === id && currentPlayerNation && u.Unit.Nation === currentPlayerNation.Nation;
        }
    }

    function applyOrderLocally(order) {
        if (!order)
            return;

        // Purge old order (if any) for this province before adding new one.
        this.orders = _.reject(this.orders, function(o) { return o.Properties.Parts[0] === order[0]; });
        this.orders.push({ Properties: { Parts: order } });
    }

    function userCanPerformAction(phaseType) {
        var phase = this.getCurrentPhase();
        return phase && gameService.isPlayer(this.game) && phase.Properties.Type === phaseType;
    }

    /**
     * Whether a player is expected to retreat in an active season.
     * @param  {String} power The power's letter code.
     * @return {Boolean}      True if the player is expected to retreat.
     */
    function retreatExpected(power) {
        if (!this.phase)
            return false;

        return _.isString(_.findKey(this.phase.provinces, function(p) {
            return p && p.owner === power;
        }));
    }

    /**
     * Whether a player is expected to adjust in an active season.
     * @param  {String} power The power's letter code.
     * @return {Boolean}      True if the player is expected to adjust.
     */
    function adjustExpected(power) {
        if (!this.phase)
            return false;

        // FIXME: Not accurate, obviously.
        return true;
    }

    function getSCPath() {
        return $location.absUrl() + '#sc';
    }

    function getCurrentAction() {
        return _currentAction;
    }

    function getStatusDescription() {
        var currentPhase = this.getCurrentPhase(),
            playersNeeded;

        if (!this.game.Finished) {
            if (!this.game.Started) {
                playersNeeded = this.variant.Nations.length - this.game.Members.length;
                return 'Not started: waiting on ' + playersNeeded + ' more ' + pluralize('player', playersNeeded);
            }
            else if (this.game.Started && currentPhase) {
                return currentPhase.Properties.Season + ' ' + currentPhase.Properties.Type + ' ' + currentPhase.Properties.Year;
            }
        }
        else {
            return 'Finished';
        }
    }

    function getReadableDeadline() {
        var currentPhase = this.getCurrentPhase(),
            timeUntilDeadline;
        if (!this.game.Finished) {
            if (this.game.Started && currentPhase) {
                timeUntilDeadline = new Date(currentPhase.Properties.DeadlineAt).getTime() - new Date().getTime();
                return humanizeDuration(timeUntilDeadline, {
                    largest: 2,
                    round: true,
                    units: ['mo', 'w', 'd', 'h', 'm']
                });
            }

            // TODO: Handle paused states.
        }
        else {
            return '';
        }
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
            target = _clickedProvinces.shift(),
            sourceProvince = variantService.getProvinceInVariant(variant, source);

        // Source can't move to itself. Treat as hold.
        if (source === target)
            return buildDefaultOrder(source);

        // Discern between Move and MoveViaConvoy by examining graph edges.
        if (!sourceProvince.Subs[''].Edges[target])
            return [source, 'MoveViaConvoy', target];

        return [source, 'Move', target];
    }

    function buildSupportOrder() {
        // Source -> target.
        if (_clickedProvinces.length < 2)
            return null;

        var source = _clickedProvinces.shift(),
            target = _clickedProvinces.shift();

        // Source can't support itself. Treat as hold.
        if (source === target)
            return buildDefaultOrder(source);

        return [source, 'Support', target];
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

    function buildBuildOrder() {
    }

    function buildDisbandOrder() {
    }
}]);
