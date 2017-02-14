angular.module('gamelistitem.component', ['mapService', 'ngMaterial', 'variantService'])
.component('sgGameListItem', {
    bindings: {
        game: '<',
        joinable: '<'
    },
    controller: 'GameListItemController',
    templateUrl: 'app/components/gamelistitem/gamelistitem.tmpl.html'
});
