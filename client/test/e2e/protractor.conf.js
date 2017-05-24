exports.config = {
    framework: 'mocha',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*.spec.js'],
    multiCapabilities: [{
        browserName: 'chrome'
    }]
};
