'use strict';

angular.module('variantService', [])
.factory('variantService', ['$http', 'Restangular', function($http, Restangular) {
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
                    variants = variants.Properties;
                    variant = _.find(variants, 'Name', variantName);
                    return $http.get('variants/' + normalisedVariantName + '/' + normalisedVariantName + '.json');
                })
                .then(function(variantCoordinates) {
                    variant.Graph.Nodes = _.merge(variant.Graph.Nodes, variantCoordinates);

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
            return Restangular.all('Variants').customGET();
        }
    };
}]);
