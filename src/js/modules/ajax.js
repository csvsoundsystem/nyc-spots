/* globals XMLHttpRequest */
export default function ajax (url, cb) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      cb(null, resp);
    } else {
      cb(new Error('File loading error'));
    }
  };

  request.onerror = function () {
    cb(new Error('Connection error'));
  };
  request.send();
}
