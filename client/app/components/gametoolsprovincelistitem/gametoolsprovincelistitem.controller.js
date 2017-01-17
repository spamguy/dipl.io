angular.module('gametoolsprovincelistitem.component')
.controller('GameToolsProvinceListItemController', [function() {
    var vm = this;

    vm.hasFailedOrder = hasFailedOrder;
    vm.renderOrder = renderOrder;

    function hasFailedOrder() {
        return false;
    }

    function renderOrder() {
        return '';
    }
}]);
