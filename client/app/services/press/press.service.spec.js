'use strict';

var httpBackend,
    game,
    channel,
    PressService,
    ps,
    mockUserService;

describe('Press service', function() {
    beforeEach(function() {
        game = {
            ID: 12345,
            Members: [
                { User: { Id: '123a' }, Nation: 'Germany' },
                { User: { Id: '55q5' }, Nation: 'Austria' }
            ]
        };
        channel = { NMessages: 12, Members: ['Austria', 'Germany', 'Russia', 'Turkey'] };
        mockUserService = {
            getCurrentUserID: function() { return '123a'; }
        };

        angular.mock.module('pressService');
        angular.mock.module('restangular');
        angular.mock.module('userService', function($provide) {
            $provide.value('userService', mockUserService);
        });

        inject(function(_$httpBackend_, _pressService_) {
            httpBackend = _$httpBackend_;
            PressService = _pressService_;
            ps = new PressService(game);
            ps.setChannel(channel);
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        httpBackend.verifyNoOutstandingExpectation();
    });

    it('sets and gets the currently active channel', function() {
        var channel = ps.getChannel();
        expect(channel.NMessages).to.equal(12);
        expect(channel.Members).to.have.lengthOf(4);
    });

    it('gets the currently active channel as a comma-delimited string', function() {
        expect(ps.getChannelMembersAsString()).to.equal('Austria,Germany,Russia,Turkey');
    });

    it('gets the currently active channel as a comma-delimited string with optional spaces', function() {
        expect(ps.getChannelMembersAsString(true)).to.equal('Austria, Germany, Russia, Turkey');
    });

    it('gets a list of the user\'s press channels in a game', function() {
        httpBackend.expectGET(/Game\/.+?\/Channels/).respond('[{ }, { }]');

        var channels;
        ps.getChannels()
        .then(function(o) {
            channels = o;
        });
        httpBackend.flush();
        expect(channels).to.have.lengthOf(2);
    });
});
