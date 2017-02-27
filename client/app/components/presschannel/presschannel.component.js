angular.module('gametools.component')
.component('sgPressChannel', {
    templateUrl: 'app/components/presschannel/presschannel.tmpl.html',
    bindings: {
        channel: '<',
        game: '<',
        variant: '<',
        press: '<'
    },
    controller: 'PressChannelController',
    controllerAs: 'vm'
});
