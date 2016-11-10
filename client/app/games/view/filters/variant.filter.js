angular.module('games')
.filter('variant', function() {
    'use strict';

    return function(games, variant) {
        var filtered = [],
            g;

        for (g = 0; g < games.length; g++) {
            if (games[g].variant.toLowerCase() === variant.toLowerCase())
                filtered.push(games[g]);
        }

        return filtered;
    };
});
