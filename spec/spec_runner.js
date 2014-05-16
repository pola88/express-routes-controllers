process.env['NODE_ENV'] = 'test';

var spawn = require('child_process').spawn;
var server = require('./app');
var config = require('config');

var commander = require('commander'),
  _ = require('lodash');

commander
  .option('-s, --spec <items>', 'Spec path')
  .parse(process.argv);

server.start( config, function () {
  require('./load_controllers')(server);

  var spawnArgs = [];
  var defaultSpecPath = './spec';
  
  spawnArgs.push('--captureExceptions');
  spawnArgs.push('--verbose');

  if(_.isUndefined(commander.spec)){
    spawnArgs.push(defaultSpecPath);
  }else{
    spawnArgs.push(commander.spec);
  }
  
  var jasmineNode = spawn('jasmine-node', spawnArgs, { env: process.env } );

  function logToConsole(data) {
    console.log(String(data));
  }

  jasmineNode.stdout.on('data', logToConsole);
  jasmineNode.stderr.on('data', logToConsole);
  
  jasmineNode.on('exit', function(exitCode) {
      server.close();
  });
});