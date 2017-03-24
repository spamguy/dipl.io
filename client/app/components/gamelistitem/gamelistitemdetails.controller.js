angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['service', '$mdDialog', 'svg', function(service, $mdDialog, svg) {
    var dg = this;

    dg.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    dg.closeDialog = closeDialog;
    dg.service = service;
    dg.readableDuration = humanizeDuration(dg.service.game.PhaseLengthMinutes * 60 * 1000, { largest: 2 });

    function closeDialog() {
        $mdDialog.hide();
    }
}]);
