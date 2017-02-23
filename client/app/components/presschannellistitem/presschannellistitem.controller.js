angular.module('gametools.component')
.controller('PressChannelListItemController', [function() {
    var vm = this;

    vm.channelMembersAsParam = channelMembersAsParam;
    function channelMembersAsParam() {
        return _.map(vm.channel.Properties.Members, function(m) { return m[0]; }).join('');
    }
}]);
