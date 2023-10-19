process.env.NODE_ENV = 'test';

var server = require('./app');
var config = require('config');

const { SpecReporter } = require('jasmine-spec-reporter');
const Jasmine = require('jasmine')
const _ = require('lodash');

const specFilter = process.argv[2];

const jasmine = new Jasmine();
jasmine.loadConfig({
  spec_dir: 'spec',
  spec_files: ['**/*_spec.js'],
  helpers: ['./spec_helper.js'],
  env: {
    failSpecWithNoExpectations: false,
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: false,
  },
});
jasmine.env.clearReporters();
jasmine.env.addReporter(
  new SpecReporter({ summary: { displayStacktrace: 'raw' } }),
);
// Remove the default dot.
jasmine.configureDefaultReporter({ print: function () {} });

afterAll(() => server.close())

server.start( config, function () {
  require('./load_controllers')(server);
  jasmine.execute(undefined, specFilter);
});
