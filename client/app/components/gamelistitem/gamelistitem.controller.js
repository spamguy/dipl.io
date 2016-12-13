angular.module('gamelistitem.component')
.controller('GameListItemController', ['gameService', 'mapService', '$mdDialog', '$mdPanel', '$state', 'variantService',
function(gameService, MapService, $mdDialog, $mdPanel, $state, variantService) {
    this.game = this.game.Properties;
    var vm = this;

    vm.reasonForNoJoin = reasonForNoJoin;
    vm.showJoinDialog = showJoinDialog;
    vm.goToGame = goToGame;
    vm.showDetailsDialog = showDetailsDialog;

    // Fetch remaining data.
    Promise.all([
        variantService.getVariant(vm.game.Variant),
        gameService.getPhases(vm.game.ID)
    ])
    .spread(buildMapService);

    // PRIVATE FUNCTIONS

    function buildMapService(variant, phases) {
        vm.service = new MapService(variant, vm.game, phases);
    }

    function reasonForNoJoin() {
        // Breaking this down into individual rules to avoid one monstrous if() statement.

        // User belongs to game already, whether as GM or user.
        if (gameService.isPlayer(vm.game))
            return 'You already are a player in this game.';

        return null;
    }

    function goToGame() {
        $state.go('games.view', { id: vm.game.ID });
    }

    function showJoinDialog(event) {
        var confirm = $mdDialog.confirm()
            .title('Really join?')
            .textContent('Are you sure you want to join this game? By clicking OK you are agreeing to participate to the best of your ability. See the FAQ and Community Guidelines for details.')
            .ariaLabel('Really join game?')
            .targetEvent(event)
            .ok('Join')
            .cancel('Cancel');

        $mdDialog.show(confirm)
        .then(function() {
            return gameService.joinGame(vm.game, { });
        })
        .then(function() {
            return $state.go('profile.games');
        });
    }

    function showDetailsDialog(event) {
        $mdDialog.show({
            controller: 'GameListItemDetailsController',
            controllerAs: 'dg',
            templateUrl: 'app/components/gamelistitem/gamelistitemdetails.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                game: vm.game,
                variant: variantService.getVariant(vm.game.Variant),
                svg: variantService.getVariantSVG(vm.game.Variant),
                phases: gameService.getPhases(vm.game.ID),
                status: vm.phaseDescription
            }
        });
    }
}]);
