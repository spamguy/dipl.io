angular.module('diplomacy')
.filter('provinceHasUnit', [function() {
    'use strict';

    return function(provinces, unitType, isDislodged) {
        return _.filter(provinces, function(p) {
            if (isDislodged)
                return p.dislodged && (!unitType || p.dislodged.type === unitType);
            else
                return p.unit && (!unitType || p.unit.type === unitType);
        });
    };
}]);
