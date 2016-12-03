'use strict';

angular.module('profile')
.controller('UserGamesController', ['games', 'waiting',
function(games, waiting) {
    var vm = this;
    vm.playing = games.Properties;
    vm.waiting = waiting.Properties;
}]);
