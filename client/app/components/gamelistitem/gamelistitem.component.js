angular.module('gamelistitem.component', ['mapService', 'ngMaterial', 'variantService'])
.component('sgGameListItem', {
    bindings: {
        game: '<',
        joinable: '<'
    },
    controller: 'GameListItemController',
    controllerAs: 'vm',
    templateUrl: 'app/components/gamelistitem/gamelistitem.tmpl.html'
});
