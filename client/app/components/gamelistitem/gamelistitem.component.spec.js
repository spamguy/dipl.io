describe.only('Game list item directive', function() {
    'use strict';

    var moment = require('moment'),
        el,
        compile,
        scope,
        mockUserService,
        mockGameService,
        mockUser,
        httpBackend;

    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gamelistitem.component');

        mockUser = {
            ID: 123
        };

        mockUserService = {
            getCurrentUser: function() {
                return mockUser;
            }
        };
        mockGameService = {
            getPhases: sinon.stub().returnsPromise().resolves({ Properties: [] })
        };

        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });
    });

    beforeEach(function() {
        inject(function($injector, $compile, $rootScope, $httpBackend) {
            scope = $rootScope;
            compile = $compile;
            httpBackend = $httpBackend;

            // Icon fetches are to be expected.
            httpBackend.whenGET(/\/icons\//).respond(200);

            scope.game = {
                Desc: 'Test Game',
                Members: [ { }, { } ]
            };
            scope.variant = { name: 'Standard' };
        });
    });

    it('displays the name', function() {
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h1.md-title', el)).to.have.text('Test Game');
    });

    describe('Phase description', function() {
        it('displays the correct phase and year during active games', function() {
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('Spring Movement 1901');
        });

        it('displays the number of remaining needed players during new games', function() {
            scope.game.status = 0;
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('(waiting on 7 more players)');
        });

        it('displays a completion message if the game is completed', function() {
            scope.game.Finished = true;
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('Finished');
        });
    });

    it('displays the largest two units in deadline during active games', function() {
        el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect(el.isolateScope().readableTimer).to.equal('1 day, 2 hours');
    });

    it('rounds off seconds in deadline', function() {
        scope.game.phases[0].deadline = moment.utc().add({ minutes: 3, seconds: 12, milliseconds: 144 });
        el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect(el.isolateScope().readableTimer).to.equal('3 minutes, 12 seconds');
    });

    describe('\'Join\' button', function() {
        it('displays the button according to state of \'joinable\' flag', function() {
            // PART I: joinable = true.
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.have.lengthOf(1);

            // PART II: joinable = false.
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.have.lengthOf(0);
        });

        it('is disabled if player\'s score is too low', function() {
            // Part I: 100 points.
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).not.to.be.disabled;

            // PART II: 0 points.
            mockUser.actionCount = 0;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });

        it('is disabled if player is in game already', function() {
            scope.game.Members.push(mockUser);
            el = compile('<sg-game-list-item game="game" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });
    });
});
