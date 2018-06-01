/* globals L */
import loadSpots from './modules/loadSpots.js';
import {default as _} from 'underscore';
import legendColors from './modules/legendColors.js';
import prettyGroup from './modules/prettyGroup.js';
import bow from './modules/blackOrWhite.js';

const layer = new L.StamenTileLayer('terrain');
const map = new L.Map('map', {
  center: new L.LatLng(40.7270841, -73.9691309),
  zoom: 12
});

map.addLayer(layer);

loadSpots('data/spots.csv', (err, geojson) => {
  if (err) {
    console.error(err);
  } else {
    // lazily take the first group listed if there are multiple
    geojson.features.forEach(feature => {
      feature.properties.labelGroup = feature.properties.group.split('|')[0];
    });
    addPoints(geojson.features);
  }
});

let groups = {};

function addPoints (features) {
  const uniqueGroups = _.chain(features)
    .map(feature => feature.properties.group.split('|'))
    .flatten()
    .uniq()
    .value();

  uniqueGroups.forEach((group, i) => {
    let index = i;
    while (index > legendColors.length) {
      index -= legendColors.length;
    }
    groups[group] = {
      color: legendColors[index],
      icon: L.divIcon({className: `group-${index} marker-icon`})
    };
  });

  features.forEach(feature => {
    L.marker(feature.geometry.coordinates.slice().reverse(), {
      icon: groups[feature.properties.labelGroup].icon
    }).on('click', function (e) {
      window.open(feature.properties.link);
    }).on('mouseover', function (e) {
      this.openPopup();
    }).on('mouseout', function (e) {
      this.closePopup();
    }).bindPopup(`
      <div class="popup-banner" style="background-color:${groups[feature.properties.labelGroup].color};color:${bow(groups[feature.properties.labelGroup].color)}">
        ${prettyGroup(feature.properties.group)}
      </div>
      <div class="popup-title">${feature.properties.title}</div>
      <div class="popup-dek">${feature.properties.dek}</div>
      <div class="popup-address">
        <a href="${feature.properties.link}" rel="noopener" target="_blank">
          ${feature.properties.address.replace(',', '<br/>')}
        </a>
      </div>
    `).addTo(map);
  });
}
