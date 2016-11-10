'use strict';

angular.module('signupform.directives', ['userService'])
.directive('sgCompareTo', [function() {
    return {
        scope: {
            otherModelValue: '=sgCompareTo'
        },
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
}]);
