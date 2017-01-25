angular.module('gametoolsprovincelistitem.component')
.controller('GameToolsProvinceListItemController', ['$scope', function($scope) {
    var vm = this,
        order = vm.service.getOrderForProvince(vm.province.Province);

    vm.hasFailedOrder = hasFailedOrder;
    vm.renderOrderSymbol = renderOrderSymbol;
    vm.renderOrderTarget = renderOrderTarget;
    vm.renderActionOfTarget = renderActionOfTarget;
    vm.renderOrderTargetOfTarget = renderOrderTargetOfTarget;

    // Process only unstripped orders.
    if (order)
        order = order.Properties.Parts;

    // Keep an eye out for changes to this province's orders.
    $scope.$watchCollection(function() {
        var orderTest = vm.service.getOrderForProvince(vm.province.Province);
        return _.isUndefined(orderTest) ? undefined : orderTest.Properties.Parts;
    }, function(newOrder) {
        if (newOrder)
            order = newOrder;
    });

    function hasFailedOrder() {
        return false; // TODO: Add failure class.
    }

    function renderOrderSymbol() {
        if (!order)
            return '';
        switch (order[1]) {
        case 'Move': return '⇒';
        case 'Support': return 'supports';
        case 'Hold': return 'holds';
        default: return '';
        }
    }

    function renderOrderTarget() {
        if (!order || order.length < 3)
            return '';
        return order[2].toUpperCase();
    }

    function renderOrderTargetOfTarget() {
        if (!order || order.length < 4)
            return '';

        if (order[2] === order[3])
            return '';
        return order[3].toUpperCase();
    }

    function renderActionOfTarget() {
        if (!order || order.length < 4)
            return '';

        if (!this.renderOrderTargetOfTarget() && order[1] !== 'Support')
            return '';
        if (order[2] === order[3])
            return 'hold';
        return '⇒';
    }
}]);
