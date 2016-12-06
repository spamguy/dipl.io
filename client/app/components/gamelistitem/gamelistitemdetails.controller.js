angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['game', 'mapService', '$mdDialog', 'svg', 'variant', function(game, MapService, $mdDialog, svg, variant) {
    var dg = this;

    dg.game = game;
    dg.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    dg.closeDialog = closeDialog;
    dg.service = new MapService(variant, game);

    function closeDialog() {
        $mdDialog.hide();
    }
}]);
