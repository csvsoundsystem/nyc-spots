var gracefulUnlink = require('../../utils/gracefulUnlink');
var notify = require('wsk').notify;

module.exports = {onEvent};

function onEvent (eventType, filePath, opts) {
  gracefulUnlink(filePath, (err, msg) => {
    if (err) {
      notify({
        message: 'Error deleting file...',
        value: filePath,
        display: 'error',
        error: err
      });
    } else if (msg !== 'No file') {
      notify({
        message: 'Deleted file...',
        value: filePath,
        display: 'compile'
      });
    }
  });
}
