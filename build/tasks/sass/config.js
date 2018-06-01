'use strict';

var path = require('path');
var sassModuleImporter = require('sass-module-importer');

var CONFIG = {
  filePath: 'src/css/*.scss', // Specify your SCSS files
  watchModules: 'src/css/modules/**/*.scss', // Specify your SCSS files to watch
  outStem: 'public/css/', // Specify your out CSS out file directory
  // use: plugins.map(function (plugin) { return require(plugin).call() }).concat([autoprefixer]),
  importer: sassModuleImporter(),
  includePaths: [path.resolve('./', 'src/css')], // Where to look for SCSS modules
  buildOptions: {
    compress: true,
    sourcemap: false
  },
  devOptions: {
    compress: true,
    sourcemap: true
  }
};

// The top level watch will be the same as our file paths
CONFIG.watchTopLevel = CONFIG.filePath;

module.exports = CONFIG;
