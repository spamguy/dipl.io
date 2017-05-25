describe('Variant service', function() {
    'use strict';

    var variantService,
        variant,
        httpBackend,
        rootScope,
        timeout;

    beforeEach(function() {
        variant = {
            Graph: {
                Nodes: {
                    ALB: { },
                    MUN: { SC: 'Germany' },
                    LON: { SC: 'England' }
                }
            }
        };

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
        httpBackend.expectGET('/Variants').respond('[{ "Name": "Classical" }, { "Name": "Fleet Rome" }]');

        var variants;
        variantService.getAllVariants()
        .then(function(vr) {
            variants = vr;
        });
        httpBackend.flush();
        expect(variants).to.have.lengthOf(2);
    });

    // FIXME: WHY WON'T THIS TEST WORK?!
    xit('fetches an individual variant with power and coordinate data', function(done) {
        httpBackend.expectGET('/Variants').respond('[{ "Name": "France vs Austria", "Graph": { "Nodes": { "mun": { "Subs": { } } } } }, { "Name": "Classical", "Graph": { "Nodes": { "mun": { "Subs": { } } } } }]');
        httpBackend.expectGET('variants/classical/classical.json').respond('{ "provinces": { "mun": { "x": 10, "y": 20 } }, "powers": { "A": { } } }');

        variantService.getVariant('Classical')
        .then(function(variant) {
            expect(variant).to.deep.equal({
                Name: 'Classical',
                Graph: {
                    Nodes: {
                        MUN: {
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

    it('lists SCs in the variant', function() {
        var scs = variantService.getSCsInVariant(variant);
        expect(scs).to.contain('MUN');
        expect(scs).to.contain('LON');
        expect(scs).to.not.contain('ALB');
    });

    it('gets a province\'s data from the variant graph', function() {
        expect(variantService.getProvinceInVariant(variant, 'MUN')).to.deep.equal({ SC: 'Germany' });
    });
});
