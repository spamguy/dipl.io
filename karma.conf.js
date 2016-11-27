'use strict';

module.exports = function(config) {
    config.set({
        preprocessors: {
            'karma-setup.js': ['browserify'],
            'client/temp/constants.js': ['browserify'],
            'client/app/**/*.spec.js': ['browserify'],
            'client/app/**/*.tmpl.html': ['ng-html2js'],
            'client/app/**/!(*.spec).js': ['coverage']
        },
        frameworks: ['browserify', 'mocha', 'chai-jquery', 'jquery-2.1.0', 'sinon-chai', 'chai-as-promised', 'chai'],
        files: [
            'karma-setup.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/moment/moment.js',
            'bower_components/d3/d3.js',
            'bower_components/lodash/lodash.js',
            'bower_components/humanize-duration/humanize-duration.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/restangular/dist/restangular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/angular-timer/dist/angular-timer.js',
            'bower_components/angular-material/angular-material.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/v-accordion/dist/v-accordion.js',

            // Client files.
            'client/temp/constants.js',
            'client/app/app.module.js',
            'client/app/app.controller.js',
            'client/app/**/*.service.js',
            'client/app/**/*.component.js',
            'client/app/**/*.directive.js',
            'client/app/**/*.module.js',
            'client/app/**/*.filter.js',
            'client/app/**/*.controller.js',
            'client/app/**/*.html',
            'client/app/**/*.spec.js',

            // CSS.
            'client/temp/app.css',

            // HTML files and templates.
            'client/app/**/*.tmpl.html'
        ],
        logLevel: 'INFO',
        reporters: ['dots', 'coverage'],
        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS'],
        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/',
            moduleName: 'templates'
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }//,
        // httpsServerOptions: {
        //     key: require('fs').readFileSync('dev_certs/server/my-server.key.pem', 'utf8'),
        //     cert: require('fs').readFileSync('dev_certs/server/my-server.crt.pem', 'utf8')
        // },
        // protocol: 'https:',
        // usePolling: true,
        // transports: ['xhr-polling', 'jsonp-polling']
    });
};
