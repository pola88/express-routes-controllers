import Jasmine from 'jasmine';
import { SpecReporter } from 'jasmine-spec-reporter';
import server from './app.js';

process.env.NODE_ENV = 'test';

const { default: config } = await import('config');

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
jasmine.configureDefaultReporter({ print() {} });

afterAll(() => server.close());

server.start(config, async () => {
  const { default: loadControllers } = await import('./load_controllers.js');
  await loadControllers(server);

  jasmine.execute(undefined, specFilter);
});
