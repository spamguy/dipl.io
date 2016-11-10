describe('Province list item directive', function() {
    'use strict';

    var scope,
        el,
        compile;

    beforeEach(function() {
        angular.mock.module('diplomacy.constants');
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gametoolsprovincelistitem.directive');
        angular.mock.module('gameService');

        inject(function($injector, $compile, $rootScope) {
            scope = $rootScope;
            compile = $compile;

            scope.province = {
                p: 'MOS',
                unit: {
                    type: 1,
                    power: 'R',
                    target: 'SEV'
                }
            };
        });
    });

    it('contains the associated unit', function() {
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.contain('MOS');
    });

    it('reports hold orders', function() {
        scope.province.unit.action = 'hold';
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> holds');
    });

    it('reports move orders', function() {
        scope.province.unit.action = 'move';
        scope.province.unit.target = 'SEV';

        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> → <strong>SEV</strong>');
    });

    it('reports orders supporting a holding target', function() {
        scope.province.unit.action = 'support';
        scope.province.unit.target = 'STP';

        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> supports <strong>STP</strong> ');
    });

    it('reports orders supporting a moving target', function() {
        scope.province.unit.action = 'support';
        scope.province.unit.target = 'STP';
        scope.province.unit.targetOfTarget = 'LVN';

        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> supports <strong>STP</strong> → <strong>LVN</strong>');
    });

    it('reports convoy orders', function() {
        scope.province.p = 'MOS';
        scope.province.unit.action = 'convoy';
        scope.province.unit.target = 'NRG';
        scope.province.unit.targetOfTarget = 'LVN';
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> convoys <strong>NRG</strong> → <strong>LVN</strong>');
    });

    it('reports disband orders', function() {
        scope.province.unit.action = 'disband';
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> disbands');
    });

    it('reports units still needing orders', function() {
        scope.province.unit.action = null;
        scope.province.unit.target = null;
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el).html()).to.equal('<strong>MOS</strong> <em>awaiting orders</em>');
    });

    it('applies a special class and tooltip to failed orders', function() {
        var error = 'Wore white shoes after Labor Day.';
        scope.province.unit.resolution = error;
        el = compile('<sg-province-list-item province="province" />')(scope);
        scope.$digest();
        expect($('div span', el)).to.have.class('failed');
        expect($('div', el)).to.have.attr('aria-label', error);
    });
});
