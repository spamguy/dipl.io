angular.module('diplomacy')
.filter('provinceHasSC', [function() {
    'use strict';

    return function(provinces, unitType) {
        return _.filter(provinces, function(p) {
            return p.sc !== null;
        });
    };
}]);
