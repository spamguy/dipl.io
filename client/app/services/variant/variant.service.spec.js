describe('Variant service', function() {
    'use strict';

    var variantService,
        httpBackend;

    beforeEach(function() {
        angular.mock.module('variantService');
        angular.mock.module('restangular');
        angular.mock.module('diplomacy.constants');

        inject(function(_variantService_, _$httpBackend_) {
            httpBackend = _$httpBackend_;
            variantService = _variantService_;
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

    it('fetches an individual variant with power and coordinate data', function() {
        httpBackend.expectGET('/Variants').respond('{ "Properties": [{ "Name": "Classical", "Graph": { "Nodes": { "mun": { } } } }] }');
        httpBackend.expectGET('variants/classical/classical.json').respond('{ "provinces": { "mun": { } } }');

        variantService.getVariant('Classical')
        .then(function(variant) {
            expect(variant.Graph).to.be.an('object');
            expect(variant.Graph.Nodes).to.be.an('object');
            expect(variant.Graph.Nodes.mun).to.be.an('object');
        });

        httpBackend.flush();
    });
});
