angular.module('gametools.component')
.component('sgPressChannelListItem', {
    bindings: {
        channel: '<'
    },
    controller: 'PressChannelListItemController',
    controllerAs: 'vm',
    templateUrl: 'app/components/presschannellistitem/presschannellistitem.tmpl.html'
});
