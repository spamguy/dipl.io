'use strict';

angular.module('games')
.controller('NewGameController', ['gameService', '$state', 'variants', function(gameService, $state, variants) {
    var vm = this;

    angular.extend(vm, {
        restrictions: {
            minimum: {
                enabled: false,
                rating: 1000
            },
            maximum: {
                enabled: false,
                rating: 2000
            }
        },
        move: {
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
            MinRating: null,
            MaxRating: null,

            save: function() {
                // Calculate minutes in supplied deadline.
                vm.game.PhaseLengthMinutes = vm.move.minutes + (vm.move.hours * 60) + (vm.move.days * 24 * 60);

                // Apply restrictions as desired.
                if (vm.restrictions.minimum.enabled)
                    vm.game.MinRating = vm.restrictions.minimum.rating;
                if (vm.restrictions.maximum.enabled)
                    vm.game.MaxRating = vm.restrictions.maximum.rating;

                return gameService.createNewGame(vm.game)
                .then(function(game) {
                    return $state.go('profile.games');
                })
                .catch(function(ex) {
                    console.error(ex);
                });
            }
        }
    });

    vm.variants = _.map(variants, 'Name');
}]);
