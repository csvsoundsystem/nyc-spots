'use strict';

var fs = require('fs-extra');
var path = require('path');
var notify = require('wsk').notify;
var sass = require('node-sass');
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');

module.exports = {onEvent: onEvent};

function onEvent (eventType, filePath, opts) {
  var CONFIG;
  if (!opts || !opts.use) {
    CONFIG = require('./config.js');
    Object.assign(CONFIG, opts);
  } else {
    CONFIG = opts;
  }
  var outFileName = path.basename(filePath).replace(/\.scss$/, '.css');
  var outFilePath = path.join(CONFIG.outStem, outFileName);
  var scssOptions = {
    file: filePath,
    importer: CONFIG.importer,
    includePaths: CONFIG.includePaths,
    outFile: outFilePath,
    outputStyle: CONFIG.compress ? 'compressed' : 'nested',
    sourceMap: CONFIG.sourcemap,
    sourceMapContents: CONFIG.sourcemap,
    sourceMapEmbed: CONFIG.sourcemap
  };

  sass.render(scssOptions, function (err, result) {
    if (err) {
      notify({
        message: 'Error compiling Sass file...',
        value: filePath,
        display: 'error',
        error: err
      });
    } else {
      postcss([autoprefixer])
        .process(result.css, {from: scssOptions.file, to: scssOptions.outFile, map: scssOptions.map})
        .then(function (result) {
          result.warnings().forEach(function (warn) {
            notify({
              message: 'CSS autoprefix warning...',
              value: warn.toString(),
              display: 'warn'
            });
          });
          // No errors during the compilation, write this result on the disk
          fs.outputFile(outFilePath, result.css, function (err) {
            if (err) {
              notify({
                message: 'Error writing CSS file...',
                value: outFilePath,
                display: 'error',
                error: err
              });
            } else {
              notify({
                message: 'Compiled CSS file to',
                value: outFilePath,
                display: 'compile'
              });
            }
          });
        });
    }
  });
}
