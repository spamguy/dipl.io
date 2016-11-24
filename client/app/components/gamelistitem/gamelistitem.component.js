angular.module('gamelistitem.component', ['ngMaterial'])
.component('sgGameListItem', {
    bindings: {
        game: '<',
        joinable: '<'
    },
    controller: 'GameListItemController',
    templateUrl: 'app/components/gamelistitem/gamelistitem.tmpl.html'
});
