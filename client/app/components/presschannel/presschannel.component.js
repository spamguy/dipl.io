angular.module('gametools.component')
.component('sgPressChannel', {
    bindings: {
        channel: '<'
    },
    controller: 'PressChannelController',
    controllerAs: 'vm',
    templateUrl: 'app/components/presschannel/presschannel.tmpl.html'
});
