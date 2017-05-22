xdescribe('Game tools component', function() {
    'use strict';

    var scope,
        el,
        compile,
        mockUserService;

    beforeEach(function() {
        angular.mock.module('ngStorage');
        angular.mock.module('restangular');
        angular.mock.module('ngMaterial');
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
            };
        });
    });

    it('lists no powers when the game hasn\'t started', function() {
        scope.game.Started = false;
        el = compile('<sg-game-tools powers="powers" game="game" phase-index="0" />')(scope);
        scope.$digest();
        expect($('div.md-subheader', el)).to.have.lengthOf(0);
    });
});
