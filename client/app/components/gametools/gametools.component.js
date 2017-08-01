angular.module('gametools.component', ['angular-ellipses', 'diplomacy.directives', 'userService', 'gameService', 'pressService'])
.component('sgGameTools', {
    templateUrl: 'app/components/gametools/gametools.tmpl.html',
    bindings: {
        service: '=',
        phaseIndex: '=',
        powers: '<'
    },
    controller: 'GameToolsController'
});
