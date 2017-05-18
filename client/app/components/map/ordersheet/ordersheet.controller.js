angular.module('map.component')
.controller('OrderSheetController', ['$mdBottomSheet', 'service', function($mdBottomSheet, service) {
    var vm = this;
    vm.service = service;

    vm.setCurrentActionInSheet = function(action) {
        vm.service.setCurrentAction(action);
        $mdBottomSheet.hide(action);
    };
}]);
