describe('Core Karma functionality', function() {
    xit('resolves promises using \'eventually\'', function() {
        return expect(Promise.resolve(123)).to.eventually.equal(123);
    });
});
