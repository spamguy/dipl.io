angular.module('gametoolsprovincelistitem.directive', ['ngSanitize'])
.directive('sgProvinceListItem', ['$state', '$sce', 'gameService', function($state, $sce, gameService) {
    'use strict';

    return {
        replace: false,
        restrict: 'E',
        templateUrl: 'app/directives/gametoolsprovincelistitem/gametoolsprovincelistitem.tmpl.html',
        scope: true,
        link: function(scope, element, attrs) {
            scope.provinceStatus = generateProvinceStatus();

            scope.$on('orderChange', function(event, data) {
                // FIXME: This can't be the best way to refresh this directive...can it?
                if (data.p === scope.province.p)
                    scope.provinceStatus = generateProvinceStatus();
            });

            function generateProvinceStatus() {
                var provinceStatus = '<strong>' + scope.province.Province.toUpperCase() + '</strong> ';

                    // order = _.find(scope.service.orders, function(o) { return o.Properties.Parts[0] === scope.province.Province; });

                // if (unit && unit.action) {
                //     switch (unit.action) {
                //     case 'move':
                //         provinceStatus += '→ <strong>' + unit.target + '</strong>';
                //         break;
                //     case 'support':
                //         provinceStatus += 'supports <strong>' + unit.target + '</strong> ';
                //         if (unit.targetOfTarget)
                //             provinceStatus += '→ <strong>' + unit.targetOfTarget + '</strong>';
                //         break;
                //     case 'hold':
                //         provinceStatus += 'holds';
                //         break;
                //     case 'convoy':
                //         provinceStatus += 'convoys <strong>' + unit.target + '</strong> → <strong>' + unit.targetOfTarget + '</strong>';
                //         break;
                //     case 'build':
                //         provinceStatus += 'builds a'; break;
                //     case 'disband':
                //         provinceStatus += 'disbands'; break;
                //     }
                // }
                // else {
                //     provinceStatus += '<em>awaiting orders</em>';
                // }

                return provinceStatus;
            }
        }
    };
}]);
