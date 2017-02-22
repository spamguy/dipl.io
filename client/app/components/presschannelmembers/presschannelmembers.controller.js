angular.module('gametools.component')
.controller('PressChannelMembersController', [function() {
    var vm = this;

    vm.selectedItem = null;
    vm.nationSearchText = null;

    vm.searchNations = searchNations;

    // PRIVATE FUNCTIONS

    function searchNations(query) {
        var n = 0,
            results = [];

        for (; n < vm.variant.Nations.length; n++) {
            if (_.startsWith(vm.variant.Nations[n].toLowerCase(), query.toLowerCase()))
                results.push(vm.variant.Nations[n]);
        }

        return results;
    }
}]);
