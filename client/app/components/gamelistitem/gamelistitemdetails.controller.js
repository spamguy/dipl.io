angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['service', '$mdDialog', 'svg', function(service, $mdDialog, svg) {
    var dg = this;

    dg.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    dg.closeDialog = closeDialog;
    dg.service = service;

    function closeDialog() {
        $mdDialog.hide();
    }
}]);
