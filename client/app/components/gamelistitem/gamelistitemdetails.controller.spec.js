describe('Game list item details controller', function() {
    'use strict';

    var variant,
        game,
        mockGameService,
        mdDialog,
        controller;

    beforeEach(function() {
        game = { Members: [] };
        variant = { };
        mockGameService = {

        };

        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
        });
        angular.mock.module('ui.router');
        angular.mock.module('gamelistitem.component');

        inject(function(_$controller_, _$mdDialog_) {
            mdDialog = _$mdDialog_;
            sinon.spy(mdDialog, 'hide');
            controller = _$controller_('GameListItemDetailsController', {
                variant: variant,
                game: game,
                svg: { }
            });
        });
    });

    it('closes the dialog', function() {
        controller.closeDialog();
        expect(mdDialog.hide).to.have.been.calledOnce;
    });
});
