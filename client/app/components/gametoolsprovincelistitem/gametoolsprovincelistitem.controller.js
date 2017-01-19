angular.module('gametoolsprovincelistitem.component')
.controller('GameToolsProvinceListItemController', [function() {
    var vm = this,
        order = vm.service.getOrderForProvince(vm.province.Province);

    vm.hasFailedOrder = hasFailedOrder;
    vm.renderOrderSymbol = renderOrderSymbol;
    vm.renderOrderTarget = renderOrderTarget;

    // Process only unstripped orders.
    if (order)
        order = order.Properties.Parts;

    function hasFailedOrder() {
        return false; // TODO: Add failure class.
    }

    function renderOrderSymbol() {
        if (!order)
            return '';
        switch (order[1]) {
        case 'Move': return '⇒';
        default: return '';
        }
    }

    function renderOrderTarget() {
        if (!order)
            return '';
        if (order.length < 3)
            return '';
        return order[2].toUpperCase();
    }
}]);
