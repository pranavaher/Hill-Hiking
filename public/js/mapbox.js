const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoicHJyYW5hdi1haGVyIiwiYSI6ImNrdDVicW9wYjA2eDkyeHFzcXIzcWFkNW0ifQ.bbh-oHYm8lS4m7JKCJ8J1Q';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/prranav-aher/ckt5c7d471whr18qwq7nges5l',
  scrollZoom: false,
  //   center:[lng,lat]
  // zoom:1 (1 is total zoom out)
  // interactive:false    (just image)
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';
  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  // Extend map bound  to include current location
  bounds.extend(loc.coordinates);
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    right: 100,
    left: 100,
  },
});
