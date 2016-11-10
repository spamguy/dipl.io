angular.module('diplomacy.main')
.controller('HomeController', ['$scope', '$http', 'CONST', 'loginService', '$mdToast', '$window', function($scope, $http, CONST, loginService, $mdToast, $window) {
    'use strict';

    $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D%27https%3A%2F%2Fblog.dipl.io%2Frss%27%20and%20output%3D%27atom_1.0%27&format=json')
    .then(function(response) {
        if (response.data.query.results.feed)
            $scope.blogEntries = response.data.query.results.feed.entry;
        else
            $scope.blogEntries = [];
    })
    .catch(function() {
        $scope.blogEntries = [];
    });

    angular.extend($scope, {
        user: {
            email: null,
            password: null,

            login: function() {
                $window.location = CONST.diplicityEndpoint + '/Auth/Login?redirect-to=' +
                encodeURIComponent(CONST.socketEndpoint + '/main/login');
            }
        }
    });
}]);
