alert("map.js is running"); // YOU MUST SEE THIS

console.log("KYLR map JS loaded");

const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// TEST SHAPES (NO GEOJSON)
const japan = L.rectangle([[30, 130], [45, 145]], {
  color: "#c2185b",
  fillColor: "#f4a3c4",
  fillOpacity: 0.7
}).addTo(map);

japan.on("click", () => {
  alert("Japan clicked");
  L.popup()
    .setLatLng([36, 138])
    .setContent("<b>Japan</b><br>Priority 1<br>Score: 86")
    .openOn(map);
});

const uk = L.rectangle([[50, -8], [58, 2]], {
  color: "#c2185b",
  fillColor: "#f4a3c4",
  fillOpacity: 0.7
}).addTo(map);

uk.on("click", () => {
  alert("UK clicked");
  L.popup()
    .setLatLng([54, -2])
    .setContent("<b>United Kingdom</b><br>Priority 2<br>Score: 83")
    .openOn(map);
});

const germany = L.rectangle([[47, 6], [55, 15]], {
  color: "#c2185b",
  fillColor: "#f4a3c4",
  fillOpacity: 0.7
}).addTo(map);

germany.on("click", () => {
  alert("Germany clicked");
  L.popup()
    .setLatLng([51, 10])
    .setContent("<b>Germany</b><br>Priority 3<br>Score: 81")
    .openOn(map);
});
