angular.module('gamelistitem.component', ['ngMaterial', 'mapService'])
.component('sgGameListItem', {
    bindings: {
        game: '<',
        joinable: '<'
    },
    controller: 'GameListItemController',
    templateUrl: 'app/components/gamelistitem/gamelistitem.tmpl.html'
});
