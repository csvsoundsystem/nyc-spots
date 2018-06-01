import {default as csv2geojson} from 'csv2geojson';
import ajax from './ajax.js';

export default function loadSpots (url, cb) {
  ajax(url, (err, csvStr) => {
    if (err) {
      console.error(err);
    } else {
      csv2geojson.csv2geojson(csvStr, {
        latfield: 'lat',
        lonfield: 'lng'
      }, function (err, geojson) {
        if (err) {
          cb(err);
        } else {
          cb(null, geojson);
        };
      });
    }
  });
}
