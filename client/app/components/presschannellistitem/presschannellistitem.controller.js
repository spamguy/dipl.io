angular.module('gametools.component')
.controller('PressChannelListItemController', [function() {
    var vm = this;

    vm.$onInit = function() {
        vm.channelMembersAsParam = channelMembersAsParam;
        vm.renderChannelMembers = renderChannelMembers;
    };

    function channelMembersAsParam() {
        return _.map(vm.channel.Properties.Members, function(m) { return m[0]; }).join('');
    }

    function renderChannelMembers() {
        // A broadcast is defined as press sent to everyone.
        if (vm.channel.Properties.Members.length === vm.service.variant.Nations.length)
            return 'BROADCAST';
        else
            return vm.channel.Properties.Members.join(', ');
    }
}]);
