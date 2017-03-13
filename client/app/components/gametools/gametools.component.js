angular.module('gametools.component', ['angular-ellipses', 'userService', 'gameService', 'pressService'])
.component('sgGameTools', {
    templateUrl: 'app/components/gametools/gametools.tmpl.html',
    bindings: {
        service: '=',
        phaseIndex: '=',
        powers: '<'
    },
    controller: 'GameToolsController'
});
