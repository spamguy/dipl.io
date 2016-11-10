describe('Game list item directive', function() {
    'use strict';

    var moment = require('moment'),
        el,
        compile,
        scope,
        mockUserService,
        mockGameService,
        mockUser,
        httpBackend,
        playerState,
        gmState;

    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gamelistitem.directive');

        playerState = gmState = false;

        mockUser = {
            id: '123',
            actionCount: 100,
            failedActionCount: 11
        };
        mockUserService = {
            getCurrentUser: function() {
                return mockUser;
            }
        };
        mockGameService = {
            getMoveData: sinon.stub().returnsPromise(),
            isGM: function() { return gmState; },
            isPlayer: function() { return playerState; }
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
                name: 'Test Game',
                description: 'This is a test game.',
                variant: 'Standard',
                movementClock: 24,
                minimumDedication: 1,
                gm_id: '666',
                players: [ ],
                status: 1,
                maxPlayers: 7
            };
            scope.phase = {
                season: 'Spring Movement',
                year: 1901
            };
            scope.variant = { name: 'Standard' };
        });
    });

    it('displays the name', function() {
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h1.md-title', el)).to.have.text('Test Game');
    });

    it('displays the description when \'joinable\' is true', function() {
        // PART I: Description provided.
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h2.md-subhead', el)).to.have.text('This is a test game.');

        // PART II: No description provided.
        delete scope.game.description;
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h2.md-subhead', el)).to.have.text('(no description)');
    });

    it('doesn\'t display the description when \'joinable\' is false', function() {
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h2.md-subhead', el)).to.have.lengthOf(0);
    });

    describe('Phase description', function() {
        it('displays the correct phase and year during active games', function() {
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('Spring Movement 1901');
        });

        it('displays the number of remaining needed players during new games', function() {
            scope.game.status = 0;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('(waiting on 7 more players)');
        });

        it('displays a completion message if the game is over', function() {
            scope.game.status = 2;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#phaseDescription', el)).to.have.text('Complete');
        });
    });

    it('displays the largest two units in deadline during active games', function() {
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect(el.isolateScope().readableTimer).to.equal('1 day, 2 hours');
    });

    it('rounds off seconds in deadline', function() {
        scope.game.phases[0].deadline = moment.utc().add({ minutes: 3, seconds: 12, milliseconds: 144 });
        el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect(el.isolateScope().readableTimer).to.equal('3 minutes, 12 seconds');
    });

    describe('\'Join\' button', function() {
        it('displays the button according to state of \'joinable\' flag', function() {
            // PART I: joinable = true.
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.have.lengthOf(1);

            // PART II: joinable = false.
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.have.lengthOf(0);
        });

        it('is disabled if player\'s score is too low', function() {
            // Part I: 100 points.
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).not.to.be.disabled;

            // PART II: 0 points.
            mockUser.actionCount = 0;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });

        it('is disabled if player is GM', function() {
            gmState = true;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });

        it('is disabled if player is in game already', function() {
            playerState = true;
            el = compile('<sg-game-list-item game="game" phase="phase" variant="variant" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });
    });
});
