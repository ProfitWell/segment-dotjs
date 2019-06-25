'use strict';

var integration = require('@segment/analytics.js-integration');
var Identify = require('segmentio-facade').Identify;

var ProfitWell = module.exports = integration('ProfitWell')
    .global('profitwell')
    .option('publicApiToken')
    .tag('<script src="https://public.profitwell.com/js/profitwell.js?auth={{publicApiToken}}">');

ProfitWell.prototype.initialize = function() {
  window.profitwell = window.profitwell || function() {
    window.profitwell.q = window.profitwell.q || [];
    window.profitwell.q.push(arguments);
  };

  var user = this.analytics.user();
  var traits = user.traits() || {};
  var id = new Identify({ traits: traits });
  var email = id.email();

  if (email) {
    window.profitwell('start', { user_email:email });
  } else {
    window.profitwell('start', {});
  }

  this.load(this.ready);
};
