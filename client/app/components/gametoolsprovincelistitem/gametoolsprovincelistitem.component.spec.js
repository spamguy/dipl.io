describe('Province list item component', function() {
    'use strict';

    var el,
        mockGameService,
        mockMapService,
        compile,
        scope;

    beforeEach(function() {
        mockGameService = {

        };
        mockMapService = {
            getOrderForProvince: function() {
                return {
                    Properties: {
                        Parts: ['mos', 'Move', 'STP']
                    }
                };
            }
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
            scope.service = mockMapService;
        });
    });

    it('contains the source province', function() {
        el = compile('<sg-province-list-item province="province" service="service" />')(scope);
        scope.$digest();
        expect($('div.order span.source', el).html()).to.equal('MOS');
    });
});
