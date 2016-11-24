angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['game', 'mapService', function(game, MapService) {
    var vm = this;

    vm.game = game;
    vm.closeDialog = closeDialog;
    vm.service = new MapService(game);

    function closeDialog() {
    }
}]);
