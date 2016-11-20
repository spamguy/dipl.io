'use strict';

angular.module('games')
.controller('NewGameController', ['gameService', '$localStorage', '$state', 'variants', function(gameService, $localStorage, $state, variants) {
    var vm = this;

    vm.$storage = $localStorage;
    angular.extend(vm, {
        game: {
            Started: false,
            Closed: false,
            Finished: false,
            Desc: '(no title)',
            Variant: 'Classical',
            PhaseLengthMinutes: 60 * 24,

            save: function() {
                gameService.createNewGame(vm.game)
                .then(function(game) {
                    $state.go('profile.games');
                });
            }
        }
    });

    vm.variants = _.map(variants.Properties, 'Name');
}]);
