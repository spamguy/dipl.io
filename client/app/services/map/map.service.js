/* global humanizeDuration */
angular.module('mapService', ['gameService'])
.service('mapService', ['$location', 'gameService', function($location, gameService) {
    'use strict';

    var _currentAction = 'Hold',
        _pendingOrder = [],
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
    service.prototype.isActionCurrent = isActionCurrent;
    service.prototype.isInPendingCommand = isInPendingCommand;
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

    function generateMarkerEnd(d) {
        // See CSS file for why separate markers exist for failed orders.
        var failed = d.source.unit.resolution ? 'failed' : '';
        return 'url(' + $location.absUrl() + '#' + failed + d.source.unit.action + ')';
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
     * @param  {Number} sx The source unit's x coordinate.
     * @param  {Number} sy The source unit's y coordinate.
     * @param  {Number} tx The target unit's x coordinate.
     * @param  {Number} ty The target unit's y coordinate.
     * @return {String}    An SVG path.
     */
    function generateArc(sx, sy, tx, ty) {
        var LINK_UNIT_PADDING = 20,
            dx = tx - sx,
            dy = ty - sy,
            dr = Math.sqrt(dx * dx + dy * dy),
            offsetX = (dx * LINK_UNIT_PADDING) / dr,
            offsetY = (dy * LINK_UNIT_PADDING) / dr;

        return 'M' + sx + ',' + sy + 'A' + dr + ',' + dr + ' 0 0,1 ' + (tx - offsetX) + ',' + (ty - offsetY);
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

    function getCurrentAction() {
        return _currentAction;
    }

    function clearPendingOrder() {
        while (_pendingOrder.length) _pendingOrder.pop();
    }

    function inputOrder(id, callback) {
        var sourceProvince = this.variant.Graph.Nodes[getProvinceComponent(_pendingOrder[0] || id)].Subs[getSubprovinceComponent(_pendingOrder[0] || id)];

        // TODO: Force armies to move to provinces only.

        // Users who try to control units that don't exist or don't own?
        // We have ways of shutting the whole thing down.
        // if (_pendingOrder.length === 0 &&
        //     (!province.unit || province.unit.owner !== gameService.getCurrentUserInGame(this.game).power))
        //     return;

        _pendingOrder.push(id.toLowerCase());

        switch (_currentAction) {
        case 'Hold':
            // Don't bother retaining clicks. Just continue on to send the command.
            _pendingOrder.push(_currentAction);
            break;
        case 'Move':
            // Source, target.
            if (_pendingOrder.length < 2)
                return;

            if (_pendingOrder[0] === _pendingOrder[1]) // Don't move to yourself. Treat this as a hold.
                _pendingOrder = buildDefaultOrder(id);
            else if (!sourceProvince.Edges[_pendingOrder[1]]) // Verify adjacency of source/target. Submit non-adjacent provinces as MoveViaConvoy.
                _pendingOrder.splice(1, 0, 'MoveViaConvoy');
            break;
        case 'Support':
            if (_pendingOrder.length < 3)
                return;

            if (_pendingOrder[0] === _pendingOrder[1]) // Treat as hold.
                _pendingOrder = buildDefaultOrder(id);
            else if (_pendingOrder[1] === _pendingOrder[2]) // Source + holding target.
                _pendingOrder.pop();

            _pendingOrder.splice(1, 0, 'Support');

            break;
        case 'Convoy':
            if (_pendingOrder.length < 3)
                return;

            /*
             * Don't convoy the convoyer.
             * Don't convoy into the convoyer.
             * Don't let the start equal the finish.
             * In short, source/target/target of target should be distinct.
             * Treat violations of the above as a hold.
             */
            if (_pendingOrder.length !== _.uniq(_pendingOrder).length)
                _pendingOrder = buildDefaultOrder(id);
            break;
        }

        // Making it this far means there is a full set of commands to publish.
        return gameService.publishOrder(this.game, this.getCurrentPhase(), _pendingOrder);
    }

    function applyOrderLocally() {
        // Purge old order (if any) for this province before adding new one.
        this.orders = _.reject(this.orders, function(o) { return o.Properties.Parts[0] === _pendingOrder[0]; });
        this.orders.push({ Properties: { Parts: _.clone(_pendingOrder) } });

        clearPendingOrder();
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

    function isActionCurrent(action) {
        return action === _currentAction;
    }

    function isInPendingCommand(province) {
        return _pendingOrder.indexOf(province) >= 0;
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

    function getSubprovinceComponent(id) {
        var idComponents = id.split('/');
        return idComponents[1] ? idComponents[1] : '';
    }

    function getProvinceComponent(id) {
        return id.split('/')[0];
    }

    function buildDefaultOrder(id) {
        return [id, 'Hold'];
    }
}]);
