'use strict';

angular.module('games')
.controller('GameListController', ['games', 'gameService', function(games, gameService) {
    var vm = this;

    vm.$onInit = function() {
        vm.games = games;
        vm.service = gameService;
    };
}]);
