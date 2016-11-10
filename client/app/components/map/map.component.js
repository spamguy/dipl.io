angular.module('map.component', ['mapService', 'timer'])
.component('sgMap', {
    bindings: {
        svg: '=',
        service: '=',
        readonly: '<',
        header: '<'
    },
    controller: 'MapController',
    templateUrl: 'app/components/map/map.tmpl.html'
});
