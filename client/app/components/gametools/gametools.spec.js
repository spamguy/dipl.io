describe('Game tools component', function() {
    'use strict';

    var scope,
        el,
        compile,
        mockUserService;

    beforeEach(function() {
        angular.mock.module('ui.router');
        angular.mock.module('diplomacy.constants');
        angular.mock.module('templates');
        angular.mock.module('gametools.component');
        mockUserService = {
            getCurrentUserID: function() {
                return '12345';
            }
        };
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('gameService');

        inject(function($injector, $compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();

            scope.powers = {
                'A': {
                    name: 'Austria'
                },
                'E': {
                    name: 'England'
                },
                'F': {
                    name: 'France'
                },
                'I': {
                    name: 'Italy'
                }
            };
            scope.game = {
                status: 1,
                players: [],
                phases: [{
                    provinces: {
                        'BUD': {
                            unit: {
                                power: 'A',
                                type: 1
                            }
                        },
                        'HUN': {
                            unit: {
                                power: 'A',
                                type: 1
                            }
                        },
                        'ROM': {
                            unit: {
                                power: 'I',
                                type: 1
                            }
                        },
                        'BUL': {
                            unit: {
                                power: 'A',
                                type: 1
                            }
                        }
                    }
                }]
            };
        });
    });

    it('lists all powers when viewing as a GM', function() {
        scope.game.gmID = '12345';
        el = compile('<sg-game-tools powers="powers" game="game" phase-index="0" />')(scope);
        scope.$digest();
        expect($('div.md-subheader', el)).to.have.lengthOf(4);
    });

    it('lists no powers when the game is inactive', function() {
        scope.game.status = 2;
        el = compile('<sg-game-tools powers="powers" game="game" phase-index="0" />')(scope);
        scope.$digest();
        expect($('div.md-subheader', el)).to.have.lengthOf(0);
    });

    it('only lists assigned power when viewing as a player', function() {
        scope.game.players.push({
            player_id: '12345',
            power: 'F'
        });
        el = compile('<sg-game-tools powers="powers" game="game" phase-index="0" />')(scope);
        scope.$digest();
        expect($('div.md-subheader', el)).to.have.lengthOf(1);
        expect($('div.md-subheader', el).html()).to.contain('France');
    });
});
