/* global firebase */
'use strict';

angular.module('diplomacy', [
    'diplomacy.constants',
    'ui.router',
    'userService',
    'gameService',
    'games',
    'diplomacy.main',
    'profile',
    'map.component',
    'gamelistitem.component',
    'ngMaterial',
    'ngStorage',
    'restangular'
])
.config(['CONST', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$localStorageProvider', '$mdThemingProvider', '$mdIconProvider', 'RestangularProvider',
function(CONST, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $localStorageProvider, $mdThemingProvider, $mdIconProvider, RestangularProvider) {
    $urlRouterProvider.otherwise('/main/home');

    // Material design theme definitions.
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo', {
            default: '400'
        })
        .accentPalette('red', {
            default: '900'
        });

    // Icon definitions.
    $mdIconProvider
        .icon('menu', '/assets/icons/ic_more_vert_24px.svg', 24)
        .icon('addperson', '/assets/icons/ic_person_add_24px.svg', 24)
        .icon('play', '/assets/icons/ic_play_arrow_24px.svg', 24)
        .icon('eject', '/assets/icons/ic_eject_24px.svg', 24)
        .icon('join', '/assets/icons/ic_call_merge_24px.svg', 24)
        .icon('new', '/assets/icons/ic_add_24px.svg', 24)
        .icon('fold-out', '/assets/icons/ic_unfold_more_24px.svg', 24)
        .icon('fold-in', '/assets/icons/ic_unfold_less_24px.svg', 24)
        .icon('settings', '/assets/icons/ic_settings_48px.svg', 48)
        .icon('clock', '/assets/icons/ic_query_builder_black_48px.svg', 48)
        .icon('account', '/assets/icons/ic_account_circle_black_48px.svg', 48)
        .icon('calendar', '/assets/icons/ic_date_range_black_48px.svg', 48)
        .icon('map', '/assets/icons/ic_map_black_48px.svg', 48)
        .icon('first', '/assets/icons/ic_first_page_black_48px.svg', 48)
        .icon('previous', '/assets/icons/ic_chevron_left_black_48px.svg', 48)
        .icon('next', '/assets/icons/ic_chevron_right_black_48px.svg', 48)
        .icon('last', '/assets/icons/ic_last_page_black_48px.svg', 48)
        .icon('info', '/assets/icons/ic_help_black_48px.svg', 48);

    // Local storage setup.
    $localStorageProvider.setKeyPrefix('diplomacy');

    // Hide ugly # in URL.
    $locationProvider.html5Mode(true);

    // Set up default config for communication with Diplicity.
    RestangularProvider.setBaseUrl(CONST.diplicityEndpoint);
    RestangularProvider.setDefaultHeaders({ Accept: 'application/json' });
}])
.run(['Restangular', '$rootScope', 'userService', function(Restangular, $rootScope, userService) {
    Restangular.setErrorInterceptor(userService.apiErrorHandler);

    // Tie Bluebird to Angular digest cycle.
    Promise.setScheduler(function(cb) {
        $rootScope.$evalAsync(cb);
    });

    // Initialise Firebase messaging.
    firebase.initializeApp({
        apiKey: 'AIzaSyB0rX7dts3Rk0UnDRR9A4vghO01mwCvLxY',
        authDomain: 'diplicity-engine.firebaseapp.com',
        databaseURL: 'https://diplicity-engine.firebaseio.com',
        storageBucket: 'diplicity-engine.appspot.com',
        messagingSenderId: '635122585664'
    });

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    var messaging = firebase.messaging(),
        fcmToken;
    messaging.requestPermission()
    .then(function() {
        console.log('Notification permission granted.');
        return messaging.getToken();
    })
    .then(function(token) {
        console.log('FCM token = ' + token);
        fcmToken = token;
    })
    .catch(function(ex) {
        console.error(ex);
    });

    userService.applyTokens(fcmToken);

    messaging.onMessage(function(payload) {
        userService.getMessageConfig()
        .then(function(config) {
            console.log('Message received: ' + payload.toString());
        });
    });
}]);
