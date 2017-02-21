angular.module('gametools.component')
.component('sgPressChannelMembers', {
    bindings: {
        members: '=',
        variant: '<',
        locked: '<'
    },
    controller: 'PressChannelMembersController',
    controllerAs: 'vm',
    templateUrl: 'app/components/presschannelmembers/presschannelmembers.tmpl.html'
});
