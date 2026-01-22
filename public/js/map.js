mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates,
  zoom: 9,
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <h6 style="margin:0;">${listing.title}</h6>
  <p style="margin:0;">${listing.location}</p>
`);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)     // ✅ show popup on click
  .addTo(map);


  