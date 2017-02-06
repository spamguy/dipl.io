'use strict';

angular.module('profile')
.controller('UserGamesController', ['finished', 'games', 'gameService', 'waiting', function(finished, games, gameService, waiting) {
    var vm = this;
    vm.playing = games.Properties;
    vm.waiting = waiting.Properties;
    vm.finished = finished.Properties;
    vm.service = gameService;
}]);
