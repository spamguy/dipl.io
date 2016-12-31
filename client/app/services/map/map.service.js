/* global humanizeDuration */
angular.module('mapService', ['gameService'])
.service('mapService', ['$location', 'gameService', function($location, gameService) {
    'use strict';

    var _currentAction = 'hold',
        _commandData = [],
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
    service.prototype.inputCommand = inputCommand;
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
        return sc ? this.variant.Powers[p.SC[0]].colour : '#ccc';
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
        clearAllCommands();
    }

    function getCurrentAction() {
        return _currentAction;
    }

    function clearAllCommands() {
        while (_commandData.length) _commandData.pop();
    }

    function inputCommand(id, callback) {
        var p = id.toUpperCase().replace('-', '/'), // HTML IDs use - for subdivisions.
            province = this.phase.provinces[p],
            overrideAction;

        // TODO: Force armies to move to provinces only.

        // Users who try to control units that don't exist or don't own?
        // We have ways of shutting the whole thing down.
        if (_commandData.length === 0 &&
            (!province.unit || province.unit.owner !== gameService.getCurrentUserInGame(this.game).power))
            return;

        _commandData.push(p);

        switch (_currentAction) {
        case 'hold':
            // Don't bother retaining clicks. Just continue on to send the command.
            break;
        case 'move':
            // Source, target.
            if (_commandData.length < 2)
                return;

            // Don't move to yourself. Treat this as a hold.
            if (_commandData[0] === _commandData[1]) {
                _commandData.pop();
                overrideAction = 'hold';
            }
            break;
        case 'support':
            // Don't support yourself. Treat this as a hold.
            if (_commandData[0] === _commandData[1]) {
                clearAllCommands();
                overrideAction = 'hold';
            }
            // Source, target, target of target.
            else if (_commandData.length < 3) {
                return;
            }
            // Source, holding target.
            else if (_commandData[1] === _commandData[2]) {
                _commandData.pop();
            }
            break;
        case 'convoy':
            if (_commandData.length < 3)
                return;

            /*
             * Don't convoy the convoyer.
             * Don't convoy into the convoyer.
             * Don't let the start equal the finish.
             * In short, source/target/target of target should be distinct.
             * Treat violations of the above as a hold.
             */
            if (_commandData.length !== _.uniq(_commandData).length) {
                clearAllCommands();
                overrideAction = 'hold';
            }
            break;
        }

        // Making it this far means there is a full set of commands to publish.
        gameService.publishCommand(_currentAction, _commandData, this.phase,
            function(response) {
                callback(response, _commandData[0], overrideAction || _currentAction, _commandData[1], _commandData[2]);
                clearAllCommands();
            }
        );
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
        return _commandData.indexOf(province) >= 0;
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
}]);
