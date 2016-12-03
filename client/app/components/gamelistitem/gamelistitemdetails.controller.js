angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['game', 'mapService', 'variantService', function(game, MapService, variantService) {
    var vm = this;

    vm.game = game;
    vm.closeDialog = closeDialog;

    variantService.getVariant(game.Variant)
    .then(function(variant) {
        vm.service = new MapService(variant, game);
    });

    function closeDialog() {
    }
}]);
