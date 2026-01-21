console.log("map.js LOADED");

// ---------------- CREATE MAP (NO INTERACTION) ----------------
const map = L.map("map", {
  zoomControl: true,
  dragging: true,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false
}).setView([20, 0], 2);

// REMOVE MAP CLICK CAPTURE
map.off("click");

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ---------------- FORCE TOP PANE ----------------
map.createPane("countriesPane");
map.getPane("countriesPane").style.zIndex = 650;
map.getPane("countriesPane").style.pointerEvents = "auto";

// ---------------- NAME NORMALISATION ----------------
const countryNameMap = {
  "Japan": "Japan",
  "United Kingdom": "United Kingdom",
  "Germany": "Germany",
  "France": "France",
  "United States of America": "USA"
};

// ---------------- CLICK COUNTER ----------------
let clickCount = 0;

// ---------------- LOAD COUNTRIES ----------------
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(r => r.json())
  .then(geo => {

    console.log("GeoJSON loaded");

    const layer = L.geoJSON(geo, {
      pane: "countriesPane",
      interactive: true,

      style: f => {
        const name = countryNameMap[f.properties.name];
        if (name && countryData[name]) {
          return {
            fillColor: countryData[name].priority ? "#f4a3c4" : "#b7d7e8",
            fillOpacity: 0.9,
            color: "#000",
            weight: 1
          };
        }
        return {
          fillColor: "#ddd",
          fillOpacity: 0.4,
          color: "#aaa",
          weight: 0.5
        };
      },

      onEachFeature: (feature, layer) => {
        const name = countryNameMap[feature.properties.name];
        if (!name || !countryData[name]) return;

        layer.on("mousedown", e => {
          e.originalEvent.preventDefault();
          e.originalEvent.stopPropagation();

          clickCount++;
          console.log(`CLICK ${clickCount}:`, name);

          const d = countryData[name];
          const s = d.scores;

          L.popup({ closeButton: true })
            .setLatLng(e.latlng)
            .setContent(`
              <b>${name}</b><br/>
              ${d.priority ? `<b>${d.priorityRank}</b><br/>` : ""}
              <b>Total:</b> ${d.finalScore}/100
            `)
            .openOn(map);
        });
      }
    });

    layer.addTo(map);
  })
  .catch(err => console.error("GeoJSON ERROR", err));
