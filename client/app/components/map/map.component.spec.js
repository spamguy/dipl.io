describe('Map component', function() {
    'use strict';

    var scope,
        compile,
        el,
        httpBackend;

    beforeEach(function() {
        angular.mock.module('diplomacy.constants');
        angular.mock.module('templates');
        angular.mock.module('diplomacy');
        angular.mock.module('map.component');
    });

    // Shut up 'unexpected GET' errors. See https://github.com/angular-ui/ui-router/issues/212#issuecomment-130384152
    beforeEach(angular.mock.module(function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(function() {
        inject(function($injector, $rootScope, $compile, $httpBackend) {
            httpBackend = $httpBackend;
            compile = $compile;
            scope = $rootScope;

            // Icon fetches are to be expected.
            httpBackend.whenGET(/\/icons\//).respond(200);

            scope.game = {
                name: 'That Game',
                variant: 'Standard',
                phases: [{
                    year: 1901,
                    season: 'Spring Movement',
                    deadline: '2020-10-10',
                    provinces: {
                        STP: {
                            sc: null
                        }
                    }
                }],
                players: []
            };
            scope.readonly = true;
            scope.svg = new DOMParser().parseFromString('<svg height="1" width="1"><g id="mouseLayer"></g></svg>', 'image/svg+xml');
        });
    });

    describe('Map header', function() {
        it('is invisible when \'header\' flag is false', function() {
            el = compile('<sg-map game="game" phase-index="0" svg="svg" header="false" />')(scope);
            scope.$digest();
            expect($('#mapToolbar', el)).to.have.lengthOf(0);
        });

        it('is visible when \'header\' flag is true', function() {
            el = compile('<sg-map game="game" phase-index="0" svg="svg" header="true" />')(scope);
            scope.$digest();
            expect($('#mapToolbar', el)).to.have.lengthOf(1);
        });
    });

    describe('SVG element', function() {
        it('creates an SVG element with expected attributes', function() {
            el = compile('<sg-map game="game" phase-index="0" svg="svg" />')(scope);
            scope.$digest();
            expect($('svg', el)).to.have.lengthOf(1);
            expect($('svg', el)).to.have.prop('viewBox');
        });

        it('is slightly transparent when no phase is passed in', function() {
            scope.game.phases = null;

            el = compile('<sg-map game="game" phase-index="0" svg="svg" />')(scope);
            scope.$digest();
            expect($('div.mapContainer', el)).to.have.class('notStarted');
        });

        it('is fully visible when a phase is passed in', function() {
            el = compile('<sg-map game="game" phase-index="0" svg="svg" />')(scope);
            scope.$digest();
            expect($('svg', el)).to.not.have.css('notStarted');
        });
    });
});
