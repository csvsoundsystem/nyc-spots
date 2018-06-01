'use strict';

// Load our watcher module
var getTopLevelFiles = require('./helpers/getTopLevelFiles');
var path = require('path');
var watcher = require('wsk').watcher;

var CONFIG = require('./config');

/* --------------------------------------------
 * Including an item in events will run `notify` with the appropriate event as specified in `build/notify.js`
 * Optionally you can specify one or more `taskFiles` to run something when that event is triggered. See `build/tasks/watcher.js` for more information
 *
 * List which file pattern to watch and what events to watch for and their corresponding action to perform when those events occur
 * An interesting feature of the equivalent `scss -w` command is that it will watch imported files.
 * Instead, we are more simply watching all scss files in our `css/` directory
 * The one disadvantage is that CSS will be compiled if a file that is not imported changes or is added
 * This is fine though because it has no effect on the resulting CSS and is less error-prone that adding and removing listeners
 * when new files appear and disappear from different imports.
 *
 */

var pathsToWatch = require('./config.js').filePath;

var watchGroup = [
  {
    serviceName: 'sass',
    path: pathsToWatch,
    displayOptions: {
      hideChildDirs: true
    },
    events: [
      {
        type: 'change',
        taskFiles: 'build/tasks/sass/onEvent.js',
        options: CONFIG.devOptions
      },
      {
        type: 'add',
        taskFiles: 'build/tasks/sass/onEvent.js',
        options: CONFIG.devOptions
      },
      {
        type: 'unlink',
        taskFiles: 'build/tasks/sass/onEvent-unlink.js',
        targetFiles: function (filePath) {
          // If we removed a top level file, remove its corresponding css and map files
          var outFileName = path.basename(filePath).replace(/\.scss$/, '.css');
          var outFilePath = path.join(CONFIG.outStem, outFileName);
          return [
            outFilePath,
            outFilePath + '.map'
          ];
        }
      }
    ]
  },
  {
    serviceName: 'sass module',
    path: CONFIG.watchModules,
    displayOptions: {
      hideChildDirs: true
    },
    events: [
      {
        type: 'change',
        taskFiles: 'build/tasks/sass/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: CONFIG.devOptions
      },
      {
        type: 'add',
        taskFiles: 'build/tasks/sass/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: CONFIG.devOptions
      },
      {
        type: 'unlink',
        taskFiles: 'build/tasks/sass/onEvent.js',
        targetFiles: getTopLevelFiles,
        options: CONFIG.devOptions
      }
    ]
  }
];

watcher.add(watchGroup);
