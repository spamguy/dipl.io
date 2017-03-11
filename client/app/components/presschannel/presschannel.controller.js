angular.module('gametools.component')
.controller('PressChannelController', ['$mdSidenav', 'pressService', '$state', function($mdSidenav, PressService, $state) {
    var vm = this;
    vm.newpress = { text: '' };
    vm.service = new PressService(vm.game);
    vm.service.setChannel(vm.channel);

    vm.generatePressHistoryHeader = generatePressHistoryHeader;
    vm.generatePressTime = generatePressTime;
    vm.exitChannel = exitChannel;
    vm.sendPress = sendPress;

    function generatePressHistoryHeader() {
        var nMessages = vm.service.getChannel().NMessages;
        return 'Press History (' + nMessages + ' ' + pluralize('message', nMessages) + ')';
    }

    function generatePressTime(time) {
        return moment(time).format('l, LT');
    }

    function exitChannel() {
        $state.go('games.view', { id: vm.game.ID });
    }

    function sendPress() {
    }
}]);
