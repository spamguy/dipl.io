describe('Game list item directive', function() {
    'use strict';

    var el,
        compile,
        scope,
        mockVariantService,
        mockGameService,
        provide;

    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gamelistitem.component');

        mockVariantService = {
            getVariant: function() {
                return {
                    Nations: [ ]
                };
            }
        };
        mockGameService = {
            getPhases: sinon.stub().returnsPromise().resolves([{ PhaseOrdinal: 1 }]),
            getPhaseState: sinon.stub().returnsPromise().resolves([]),
            getPhaseOrders: sinon.stub().returnsPromise().resolves([]),
            isPlayer: function() { return false; },
            getCurrentUserInGame: function() { return 'Germany'; }
        };

        angular.mock.module('gameService', function($provide) {
            provide = $provide;
            provide.value('gameService', mockGameService);
            provide.value('variantService', mockVariantService);

            // Stuff icon errors: see http://stackoverflow.com/a/31302690/260460.
            provide.factory('mdIconDirective', function() {
                return angular.noop;
            });
        });
    });

    beforeEach(function() {
        inject(function($injector, $compile, $rootScope, $httpBackend) {
            scope = $rootScope;
            compile = $compile;

            scope.game = {
                Desc: 'Test Game',
                Variant: 'Classical',
                Members: [ { }, { } ],
                Started: true
            };
            scope.variant = { name: 'Standard' };
        });
    });

    it('displays the name', function() {
        el = compile('<sg-game-list-item game="game" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h1.md-title', el)).to.have.text('Test Game');
    });

    xdescribe('\'Join\' button', function() {
        it('displays the button according to state of \'joinable\' flag', function() {
            // PART I: joinable = true.
            el = compile('<sg-game-list-item game="game" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#joinButton', el)).to.have.lengthOf(1);

            // PART II: joinable = false.
            el = compile('<sg-game-list-item game="game" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#joinButton', el)).to.have.lengthOf(0);
        });

        it('is disabled if player is in game already', function() {
            mockGameService.isPlayer = function() { return true; };
            provide.value('gameService', mockGameService);

            el = compile('<sg-game-list-item game="game" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });
    });

    xdescribe('Status description', function() {
        it('displays the correct phase, phase type, and year during active games', function() {
            // expect($('#statusDescription', el)).to.have.text('Fall Movement 1901');
        });

        it('displays the number of remaining needed players during new games', function() {
            // // 'players' for multiple.
            // expect(ms.getStatusDescription()).to.equal('Not started: waiting on 4 more players');
            //
            // // 'player' for one.
            // game.Members = [{ }, { }, { }, { }];
            // expect(ms.getStatusDescription()).to.equal('Not started: waiting on 1 more player');
        });

        it('displays a completion message if the game is completed', function() {
            // game.Finished = true;
            // expect(ms.getStatusDescription()).to.equal('Finished');
        });
    });
});
