angular.module('gametools.component')
.component('sgPressChannel', {
    templateUrl: 'app/components/presschannel/presschannel.tmpl.html',
    bindings: {
        members: '='
    },
    controller: 'PressChannelController',
    controllerAs: 'vm'
});
