'use strict';

angular.module('games', [
    'ui.router',
    'ngMaterial',
    'gametools.component',
    'gametoolsprovincelistitem.component',
    'mapService',
    'vAccordion'
])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider
    .state('games', {
        abstract: true,
        url: '/games',
        template: '<ui-view />'
    })
    .state('games.list', {
        url: '',
        controller: 'GameListController as vm',
        templateUrl: 'app/games/games.html',
        data: {
            authRequired: true
        },
        resolve: {
            games: ['gameService', function(gameService) {
                return gameService.getAllOpenGames();
            }]
        }
    })
    .state('games.archive', {
        url: '/archive',
        controller: 'GameArchiveController as vm',
        templateUrl: 'app/games/archive/archive.html',
        data: {
            authRequired: true
        },
        resolve: {
            games: ['gameService', function(gameService) {
                return gameService.getAllArchivedGames();
            }]
        }
    })
    .state('games.new', {
        url: '/new',
        controller: 'NewGameController as vm',
        templateUrl: 'app/games/new/new.html',
        data: {
            authRequired: true
        },
        resolve: {
            variants: ['variantService', function(variantService) {
                return variantService.getAllVariants();
            }]
        }
    })
    .state('games.view', {
        url: '/:id/{ordinal:int}',
        controller: 'ViewController as vm',
        templateUrl: 'app/games/view/view.html',
        data: {
            authRequired: true
        },
        params: {
            ordinal: {
                value: null,
                squash: true,
                dynamic: true
            }
        },
        resolve: {
            mapService: 'mapService',
            game: ['gameService', '$stateParams', function(gameService, $stateParams) {
                return gameService.getGame($stateParams.id);
            }],
            phases: ['gameService', '$stateParams', function(gameService, $stateParams) {
                return gameService.getPhases($stateParams.id);
            }],
            phaseState: ['game', 'gameService', 'mapService', 'phases', '$stateParams', function(game, gameService, MapService, phases, $stateParams) {
                var mapService = new MapService({
                        game: game,
                        phases: phases,
                        ordinal: $stateParams.ordinal
                    }),
                    phase = mapService.getCurrentPhase();

                // No phase? No phase state.
                if (phase)
                    return gameService.getPhaseState($stateParams.id, phase);
                else
                    return null;
            }],
            options: ['game', 'gameService', 'mapService', 'phases', '$stateParams', function(game, gameService, MapService, phases, $stateParams) {
                var mapService = new MapService({
                        game: game,
                        phases: phases,
                        ordinal: $stateParams.ordinal
                    }),
                    phase = mapService.getCurrentPhase();
                return gameService.getUserOptionsForPhase(game, phase);
            }],
            orders: ['game', 'gameService', 'mapService', 'phases', '$stateParams', function(game, gameService, MapService, phases, $stateParams) {
                var mapService = new MapService({
                        game: game,
                        phases: phases,
                        ordinal: $stateParams.ordinal
                    }),
                    phase = mapService.getCurrentPhase();

                // No phase? No orders.
                if (phase)
                    return gameService.getPhaseOrders($stateParams.id, phase);
                else
                    return null;
            }],
            variant: ['variantService', 'game', function(variantService, game) {
                return variantService.getVariant(game.Variant);
            }],
            svg: ['variantService', 'game', function(variantService, game) {
                return variantService.getVariantSVG(game.Variant);
            }]
        }
    })
    .state('games.view.presschannel', {
        component: 'sgPressChannel',
        resolve: {
            members: ['$transition$', function($transition$) {
                return $transition$.targetState().params().members;
            }],
            game: ['$transition$', function($transition$) {
                return $transition$.targetState().params().game;
            }],
            variant: ['$transition$', function($transition$) {
                return $transition$.targetState().params().variant;
            }]
        },
        onEnter: ['$mdSidenav', function($mdSidenav) {
            $mdSidenav('press-channel').toggle();
        }]
    });
}]);
