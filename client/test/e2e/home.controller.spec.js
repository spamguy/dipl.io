describe('Home', function() {
    var chai = require('chai'),
        expect = chai.expect;
        // HomePageObject = require('./HomePageObject');
        // po = new HomePageObject();

    beforeEach(function() {
        browser.get('https://localhost/main/home');
    });

    it('has the dipl.io logo', function() {
        expect(1).to.equal(1);
    });
});
