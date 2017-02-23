angular.module('gametools.component')
.component('sgPressChannel', {
    templateUrl: 'app/components/presschannel/presschannel.tmpl.html',
    bindings: {
        members: '<',
        game: '<',
        variant: '<'
    },
    controller: 'PressChannelController',
    controllerAs: 'vm'
});
