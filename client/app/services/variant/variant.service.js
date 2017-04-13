'use strict';

angular.module('variantService', [])
.factory('variantService', ['$http', '$q', 'Restangular', function($http, $q, Restangular) {
    var variantCache = { };

    return {
        getNormalisedVariantName: function(variantName) {
            return variantName.replace(new RegExp(' ', 'g'), '').toLowerCase();
        },

        getVariant: function(variantName) {
            var normalisedVariantName = this.getNormalisedVariantName(variantName),
                variant;

            if (variantCache[variantName]) {
                return Promise.resolve(variantCache[variantName]);
            }
            else {
                return this.getAllVariants()
                .then(function(variants) {
                    variant = _.find(variants, 'Properties.Name', variantName).Properties;
                    return $http.get('variants/' + normalisedVariantName + '/' + normalisedVariantName + '.json');
                })
                .then(function(variantCoordinates) {
                    var key,
                        province;

                    // Convert all keys in diplicity variant definition to uppercase.
                    for (key in variant.Graph.Nodes) {
                        province = variant.Graph.Nodes[key];
                        delete variant.Graph.Nodes[key];
                        variant.Graph.Nodes[key.toUpperCase()] = province;
                    }

                    // Squish together diplicity nodes with dipl.io nodes with coordinates.
                    variant.Graph.Nodes = _.merge(variant.Graph.Nodes, variantCoordinates.data.provinces);
                    variant.Powers = variantCoordinates.data.powers;

                    // Add variant to cache and return.
                    variantCache[variantName] = variant;
                    return Promise.resolve(variantCache[variantName]);
                });
            }
        },

        /**
         * Gets diplicity variant data for all supported variants.
         * @return {[type]} [description]
         */
        getAllVariants: function() {
            return Restangular.all('Variants').getList();
        },

        getVariantSVG: function(variantName) {
            if (variantName) {
                variantName = this.getNormalisedVariantName(variantName);
                return $http.get('variants/' + variantName + '/' + variantName + '.svg');
            }
            else {
                return $q(function(resolve) {
                    resolve({ });
                });
            }
        },

        getSCsInVariant: function(variant) {
            var p,
                scs = [];

            for (p in variant.Graph.Nodes) {
                if (variant.Graph.Nodes[p].SC)
                    scs.push(p.toUpperCase());
            }

            return scs;
        },

        getProvinceInVariant: function(variant, id) {
            return variant.Graph.Nodes[id.toUpperCase()];
        }
    };
}]);
