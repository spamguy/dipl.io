describe('Variant service', function() {
    'use strict';

    var variantService,
        httpBackend,
        rootScope,
        timeout;

    beforeEach(function() {
        Promise.onPossiblyUnhandledRejection(function(error) {
            throw error;
        });
        angular.mock.module('variantService');
        angular.mock.module('restangular');
        angular.mock.module('diplomacy.constants');

        inject(function(_variantService_, _$httpBackend_, _$rootScope_, _$timeout_) {
            httpBackend = _$httpBackend_;
            variantService = _variantService_;
            rootScope = _$rootScope_;
            timeout = _$timeout_;
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        httpBackend.verifyNoOutstandingExpectation();
    });

    it('requests a list of variants', function() {
        httpBackend.expectGET('/Variants').respond('{ "Properties": [{ "Name": "Classical" }, { "Name": "Fleet Rome" }] }');

        var variants;
        variantService.getAllVariants()
        .then(function(vr) {
            variants = vr;
        });
        httpBackend.flush();
        expect(variants.Properties).to.have.lengthOf(2);
    });

    // FIXME: WHY WON'T THIS TEST WORK?!
    xit('fetches an individual variant with power and coordinate data', function(done) {
        httpBackend.expectGET('/Variants').respond('{ "Properties": [{ "Name": "Classical", "Graph": { "Nodes": { "mun": { "Subs": { } } } } }] }');
        httpBackend.expectGET('variants/classical/classical.json').respond('{ "provinces": { "mun": { "x": 10, "y": 20 } }, "powers": { "A": { } } }');

        variantService.getVariant('Classical')
        .then(function(variant) {
            expect(variant).to.deep.equal({
                Name: 'Classical',
                Graph: {
                    Nodes: {
                        mun: {
                            x: 10,
                            y: 20,
                            Subs: { }
                        }
                    }
                },
                Powers: { A: { } }
            });
        })
        .finally(done);

        httpBackend.flush();
        rootScope.$digest();
        timeout.flush();
    });
});
