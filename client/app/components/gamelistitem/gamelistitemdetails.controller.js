angular.module('gamelistitem.component')
.controller('GameListItemDetailsController', ['gameService', 'service', '$state', 'joinable', '$mdDialog', 'svg', function(gameService, service, $state, joinable, $mdDialog, svg) {
    var dg = this;

    dg.svg = new DOMParser().parseFromString(svg.data, 'image/svg+xml');
    dg.service = service;
    dg.joinable = joinable;
    dg.readableDuration = humanizeDuration(dg.service.game.PhaseLengthMinutes * 60 * 1000, { largest: 2 });

    dg.joinGame = joinGame;
    dg.closeDialog = closeDialog;
    dg.reasonForNoJoin = reasonForNoJoin;

    function closeDialog() {
        $mdDialog.hide();
    }

    function joinGame() {
        return gameService.joinGame(dg.service.game, { })
        .then(function() {
            closeDialog();
            return $state.go('profile.games');
        });
    }

    function reasonForNoJoin() {
        // User belongs to game already.
        if (gameService.isPlayer(dg.service.game))
            return 'You already are a player in this game.';

        return null;
    }
}]);
