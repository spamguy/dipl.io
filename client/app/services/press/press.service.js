/**
 * @ngdoc service
 * @name pressService
 * @description Manipulates and processes game press data.
 */
angular.module('pressService', ['gameService'])
.factory('pressService', ['gameService', 'Restangular', function(gameService, Restangular) {
    'use strict';

    var _game,
        _channel,
        service = function(game) {
            _game = game;
        };

    service.prototype.setChannel = setChannel;
    service.prototype.setChannelMembersFromParam = setChannelMembersFromParam;
    service.prototype.getChannel = getChannel;
    service.prototype.getChannelMembersAsString = getChannelMembersAsString;
    service.prototype.getChannels = getChannels;
    service.prototype.getPressInChannel = getPressInChannel;

    return service;

    // PRIVATE FUNCTIONS

    function setChannel(channel) {
        // Force current user into channel if not already present.
        var currentPlayerNation = gameService.getCurrentUserInGame(_game).Nation;
        if (channel.Members.indexOf(currentPlayerNation) === -1)
            channel.Members.unshift(currentPlayerNation);
        _channel = channel;
    }

    function setChannelMembersFromParam(param, variant) {
        this.setChannel(_.map(param.split(''), function(m) {
            return _.find(variant.Nations, function(n) {
                return m === n[0];
            });
        }));
    }

    function getChannel() {
        return _channel;
    }

    function getChannelMembersAsString(isPretty) {
        var joinString = isPretty ? ', ' : ',';
        return _channel.Members.join(joinString);
    }

    /**
     * Gets press channels within a game in which the user is participating.
     * @param  {Object} game The game.
     * @return {Promise}     A list of participating channels.
     */
    function getChannels() {
        return Restangular.one('Game', _game.ID).all('Channels').getList();
    }

    function getPressInChannel() {
        var channelMembers = _channel.Members.join(',');
        return Restangular.one('Game', _game.ID).one('Channel', channelMembers).all('Messages').getList();
    }
}]);
