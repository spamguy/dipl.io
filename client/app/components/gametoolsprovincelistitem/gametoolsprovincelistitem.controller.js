angular.module('gametoolsprovincelistitem.component')
.controller('GameToolsProvinceListItemController', ['$scope', function($scope) {
    var vm = this,
        order = vm.service.getOrderForProvince(vm.province.Province);

    vm.renderOrderSymbol = renderOrderSymbol;
    vm.renderOrderTarget = renderOrderTarget;
    vm.renderActionOfTarget = renderActionOfTarget;
    vm.renderOrderTargetOfTarget = renderOrderTargetOfTarget;
    vm.renderResolution = renderResolution;

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

    function renderOrderSymbol() {
        // FIXME: This should be info to the side and not override existing orders.
        if (unitIsDislodged())
            return 'dislodged';
        if (!order)
            return '';

        switch (order[1]) {
        case 'Move':
        case 'MoveViaConvoy': return '⇒';
        case 'Support': return 'supports';
        case 'Hold': return 'holds';
        case 'Convoy': return 'convoys';
        case 'Disband': return 'disbands';
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

    function renderResolution() {
        var phase = vm.service.getCurrentPhase(),
            resolution;
        // Nothing to render.
        if (!phase.Properties.Resolutions)
            return null;

        resolution = _.find(phase.Properties.Resolutions, ['Province', vm.province.Province]);

        return resolution ? processResolutionCode(resolution.Resolution) : '';
    }

    function processResolutionCode(code) {
        var split;
        // 'OK' is not worth showing.
        if (code === 'OK')
            return null;
        if (code.indexOf('ErrBounce') > -1) {
            split = code.split(':');
            return 'Bounced against ' + split[1].toUpperCase();
        }

        return code;
    }

    function unitIsDislodged() {
        return _.some(vm.service.getCurrentPhase().Properties.Dislodgeds, { Province: vm.province.Province });
    }
}]);
