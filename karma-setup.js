global.sinon = require('sinon');
require('sinon-stub-promise')(sinon);

// See https://github.com/ariya/phantomjs/issues/12401
global.Promise = require('es6-promise').Promise;
