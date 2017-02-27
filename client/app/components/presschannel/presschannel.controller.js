angular.module('gametools.component')
.controller('PressChannelController', ['pressService', function(PressService) {
    var vm = this;
    vm.service = new PressService(vm.game);
    vm.service.setChannel(vm.channel);

    vm.generatePressHistoryHeader = generatePressHistoryHeader;

    function generatePressHistoryHeader() {
        var nMessages = vm.service.getChannel().NMessages;
        return 'Press History (' + nMessages + ' ' + pluralize('message', nMessages) + ')';
    }
}]);
