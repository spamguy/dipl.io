describe('Games module', function() {
    'use strict';

    var mockUserService,
        $state;

    beforeEach(function() {
        mockUserService = {
            getUser: sinon.stub().returnsPromise(),
            getCurrentUser: function() { return '123'; }
        };

        mockUserService.getUser.resolves({
            _id: '123'
        });

        angular.mock.module('games', function($provide) {
            $provide.value('userService', mockUserService);
        });

        inject(function(_$state_, _$injector_) {
            $state = _$state_;
        });
    });

    it('resolves game URLs without phase parameters', function() {
        expect($state.href('games.list')).to.equal('#/games');

        // RAGE: Dev machine resolves to URL ending with /. Travis resolves to one without.
        expect($state.href('games.view', { id: '55d33430c9e0fa7a0c762b9a' })).to.match(/^#\/games\/55d33430c9e0fa7a0c762b9a/);
    });

    it('resolves game URLs with phase parameters', function() {
        expect($state.href('games.view', { id: '55d33430c9e0fa7a0c762b9a', phaseIndex: 2 })).to.equal('#/games/55d33430c9e0fa7a0c762b9a/2');
    });
});
