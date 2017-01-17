angular.module('gametoolsprovincelistitem.component', [])
.component('sgProvinceListItem', {
    templateUrl: 'app/components/gametoolsprovincelistitem/gametoolsprovincelistitem.tmpl.html',
    bindings: {
        service: '<',
        province: '<'
    },
    controller: 'GameToolsProvinceListItemController',
    controllerAs: 'vm'
});
