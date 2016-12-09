'use strict';

angular.module('profile')
.controller('UserGamesController', ['games', 'gameService', 'waiting', function(games, gameService, waiting) {
    var vm = this;
    vm.playing = games.Properties;
    vm.waiting = waiting.Properties;
    vm.service = gameService;
}]);
