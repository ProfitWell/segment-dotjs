'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var ProfitWell = require('../lib');

describe('Profit well', function() {
  var analytics;
  var profitwell;
  var options = {
    publicApiToken: '123123123'
  };

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
    beforeEach(function() {
      analytics.stub(profitwell, 'load');
    });

    afterEach(function() {
      profitwell.reset();
    });

    describe('#initialize', function() {
      it('should call load on initialize', function() {
        analytics.initialize();
        analytics.called(profitwell.load);
      });

      it('should create profitwell object', function() {
        analytics.initialize();
        analytics.assert(window.profitwell instanceof Function);
      });

      it('should call init with the user\'s email', function() {
        analytics.stub(window, 'profitwell');
        analytics.spy(window.profitwell);
        setTimeout(function() {
          analytics.initialize();
          analytics.called(window.profitwell, 'start', {
            user_email: 'gottaketchumall@poke.mon'
          });
        }, 1000);
      });
    });
  });
});
