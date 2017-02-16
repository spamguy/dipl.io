'use strict';

angular.module('profile')
.controller('UserGamesController', ['finished', 'games', 'gameService', 'waiting', function(finished, games, gameService, waiting) {
    var vm = this;
    vm.playing = games;
    vm.waiting = waiting;
    vm.finished = finished;
    vm.service = gameService;
}]);
