angular.module('map.component', ['mapService', 'timer', 'ngAnimate', 'cfp.hotkeys'])
.component('sgMap', {
    bindings: {
        svg: '=',
        service: '=',
        header: '<'
    },
    controller: 'MapController',
    templateUrl: 'app/components/map/map.tmpl.html'
});
