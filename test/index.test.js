'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var ProfitWell = require('../lib');

describe('Profitwell', function() {
  var analytics;
  var profitwell;
  var options = {
    publicApiToken: '123123123'
  };
  var testEmail = 'testEmail@pw.com';

  beforeEach(function() {
    analytics = new Analytics();
    profitwell = new ProfitWell(options);
    analytics.use(ProfitWell);
    analytics.use(tester);
    analytics.add(profitwell);
  });

  afterEach(function(done) {
    analytics.waitForScripts(function() {
      analytics.restore();
      analytics.reset();
      profitwell.reset();
      sandbox();
      done();
    });
  });

  describe('before loading', function() {
    describe('#initialize', function() {
      beforeEach(function() {
        analytics.stub(profitwell, 'load');
        analytics.stub(profitwell, 'start');
      });

      it('should call load on initialize', function() {
        analytics.initialize();

        analytics.called(profitwell.load);
      });

      it('should create profitwell object', function() {
        analytics.initialize();

        analytics.assert(window.profitwell instanceof Function);
      });

      it('should call start with email on initialize', function() {
        addTraitsToStorage()
        analytics.initialize();

        analytics.called(profitwell.start, testEmail);
      });

      it('should call start with nothing on anonymous initialize', function() {
        profitwell.options.anonymousOnly = true;
        analytics.initialize();

        analytics.called(profitwell.start);
      })
    });

    describe('#start', function() {
      beforeEach(function() {
        analytics.stub(window, 'profitwell');
      });

      it('should call start with user\'s email', function() {
        profitwell.start(testEmail);

        analytics.called(window.profitwell, 'start', { user_email: testEmail });
      });

      it('should call start with an empty object', function() {
        profitwell.start();

        analytics.called(window.profitwell, 'start', {});
      });
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.once('ready', function() {
        analytics.stub(profitwell, 'start');
        done();
      });
      analytics.initialize();
    });

    describe('#identify', function() {
      it('should call start with the user\'s email', function() {
        analytics.identify(testEmail);
        analytics.called(profitwell.start, testEmail);
      });

      it('should call start with an empty object', function() {
        analytics.identify();
        analytics.called(profitwell.start);
      });
    });
  });

  function addTraitsToStorage() {
    // this is a hack to get analytics to initialize a user with an email
    localStorage.setItem(
      'ajs_user_traits', 
      JSON.stringify({ email: testEmail })
    );
  }
});
