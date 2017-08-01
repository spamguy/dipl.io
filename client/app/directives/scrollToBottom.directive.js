angular.module('diplomacy.directives', [])
.directive('sgScrollToBottom', function() {
    return {
        scope: {
            scrollToBottom: '='
        },
        link: function(scope, element) {
            scope.$watchCollection('$parent.vm.press', function(newValue) {
    //            if (newValue) {
                var domElement = document.getElementById(element[0].id);
                if (domElement.lastElementChild && domElement.lastElementChild.scrollIntoView)
                    domElement.lastElementChild.scrollIntoView();
        //        }
            });
        }
    };
});
