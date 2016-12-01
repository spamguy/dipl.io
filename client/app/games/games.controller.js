'use strict';

angular.module('games')
.controller('GameListController', ['games', function(games) {
    var vm = this;
    vm.games = games.Properties;
}]);
