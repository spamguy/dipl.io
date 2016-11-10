angular.module('gametools.component', ['userService', 'gameService'])
.component('sgGameTools', {
    templateUrl: 'app/components/gametools/gametools.tmpl.html',
    bindings: {
        service: '=',
        phaseIndex: '=',
        powers: '<'
    },
    controller: 'GameToolsController'
});
