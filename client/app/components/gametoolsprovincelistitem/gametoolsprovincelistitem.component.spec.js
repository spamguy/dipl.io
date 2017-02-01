describe('Province list item component', function() {
    'use strict';

    var el,
        mockGameService,
        mockMapService = function(bogusOrders) {
            return {
                getOrderForProvince: function() {
                    return {
                        Properties: {
                            Parts: bogusOrders
                        }
                    };
                },
                getCurrentPhase: function() {
                    return { Properties: { } };
                }
            };
        },
        compile,
        scope;

    beforeEach(function() {
        mockGameService = {

        };

        angular.mock.module('diplomacy.constants');
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gametoolsprovincelistitem.component');
        angular.mock.module('gameService', function($provide) {
            $provide.value('gameService', mockGameService);
            $provide.value('mapService', mockMapService);
        });
        angular.mock.module('mapService');
        inject(function($injector, $compile, $rootScope) {
            scope = $rootScope.$new();
            compile = $compile;

            scope.province = {
                Province: 'mos'
            };
        });
    });

    it('contains the source province', function() {
        scope.service = mockMapService(['mos', 'Move', 'STP']);
        el = compile('<sg-province-list-item province="province" service="service" />')(scope);
        scope.$digest();
        expect($('div.order span.source', el).html()).to.equal('MOS');
    });

    describe('Move order', function() {
        beforeEach(function() {
            scope.service = mockMapService(['mos', 'Move', 'STP']);
            el = compile('<sg-province-list-item province="province" service="service" />')(scope);
            scope.$digest();
        });

        it('contains a tiny arrow symbol', function() {
            expect($('div.order span.action', el).html()).to.equal('⇒');
        });

        it('contains the target', function() {
            expect($('div.order span.target', el).html()).to.equal('STP');
        });
    });

    describe('Hold order', function() {
        beforeEach(function() {
            scope.service = mockMapService(['ven', 'Hold']);
            el = compile('<sg-province-list-item province="province" service="service" />')(scope);
            scope.$digest();
        });

        it('contains the action', function() {
            expect($('div.order span.action', el).html()).to.equal('holds');
        });

        it('has no target', function() {
            expect($('div.order span.target', el).html()).to.equal('');
        });
    });
});
