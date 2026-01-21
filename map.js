console.log("KYLR map script loaded");

// ---- BASIC MAP ----
const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// ---- TEST CLICK (GLOBAL) ----
map.on("click", () => {
  console.log("Map clicked");
});

// ---- DATA ----
const countryData = {
  "Japan": { score: 86, priority: "Priority 1" },
  "United Kingdom": { score: 83, priority: "Priority 2" },
  "Germany": { score: 81, priority: "Priority 3" },
  "France": { score: 74 },
  "United States of America": { score: 68 }
};

// ---- LOAD COUNTRIES ----
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(res => res.json())
  .then(geo => {

    console.log("GeoJSON loaded");

    L.geoJSON(geo, {

      style: feature => {
        const name = feature.properties.name;

        if (countryData[name]) {
          return {
            fillColor:
              name === "Japan" ||
              name === "United Kingdom" ||
              name === "Germany"
                ? "#f4a3c4"
                : "#b7d7e8",
            fillOpacity: 0.8,
            color: "#333",
            weight: 1
          };
        }

        return {
          fillColor: "#eeeeee",
          fillOpacity: 0.3,
          color: "#ccc",
          weight: 0.5
        };
      },

      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;

        layer.on("click", e => {
          console.log("Country clicked:", name);

          if (countryData[name]) {
            const info = countryData[name];

            let html = `<b>${name}</b><br/>`;
            if (info.priority) html += `<b>${info.priority}</b><br/>`;
            html += `Score: ${info.score}/100`;

            L.popup()
              .setLatLng(e.latlng)
              .setContent(html)
              .openOn(map);
          }
        });
      }

    }).addTo(map);
  })
  .catch(err => console.error("GeoJSON error", err));
