global.chai = require('chai');
global.chai.use(require('chai-as-promised'));
global.chai.use(require('chai-jquery'));

global.sinon = require('sinon');
require('sinon-stub-promise')(sinon);

// See https://github.com/ariya/phantomjs/issues/12401
// FIXME: This and Bluebird break chai-as-promised.
global.Promise = require('es6-promise').Promise;
