'use strict';

angular.module('games')
.controller('NewGameController', ['gameService', '$state', 'variants', function(gameService, $state, variants) {
    var vm = this;

    angular.extend(vm, {
        move: {
            minutes: 0,
            hours: 0,
            days: 1
        },
        retreat: {
            minutes: 0,
            hours: 0,
            days: 1
        },
        adjust: {
            minutes: 0,
            hours: 0,
            days: 1
        },
        game: {
            Started: false,
            Closed: false,
            Finished: false,
            Desc: '(no title)',
            Variant: 'Classical',
            PhaseLengthMinutes: 60 * 24,

            save: function() {
                // Calculate minutes in supplied deadline.
                vm.game.PhaseLengthMinutes = vm.move.minutes + (vm.move.hours * 60) + (vm.move.days * 24 * 60);

                return gameService.createNewGame(vm.game)
                .then(function(game) {
                    return $state.go('profile.games');
                });
            }
        }
    });

    vm.variants = _.map(variants, 'Name');
}]);
