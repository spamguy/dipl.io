'use strict';

angular.module('games')
.controller('GameArchiveController', ['games', function(games) {
    var vm = this;

    vm.games = games.Properties;
}]);
