'use strict';

var glob = require('glob');
var notify = require('wsk').notify;
var processFilePath = require('./onEvent');

var CONFIG = require('./config.js');

// Load this task file in case we want to delete things
var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .example('$0 --compress --sourcemap')
  .option('m', {
    alias: 'sourcemap',
    describe: 'Create sourcemap',
    type: 'boolean',
    default: CONFIG.buildOptions.sourcemap
  })
  .option('c', {
    alias: 'compress',
    describe: 'Compress CSS output',
    type: 'boolean',
    default: CONFIG.buildOptions.compress
  })
  .help('h')
  .alias('h', 'help')
  .argv;

CONFIG.sourcemap = argv.m; // Create sourcemap?
CONFIG.compress = argv.c; // Compress CSS output?

glob(CONFIG.filePath, function (err, filePaths) {
  if (err) {
    notify({
      message: 'Error reading SCSS glob.',
      value: CONFIG.filePath,
      display: 'error',
      error: err
    });
  } else {
    filePaths.forEach(function (filePath) {
      processFilePath.onEvent(null, filePath, CONFIG);
    });
  }
});
