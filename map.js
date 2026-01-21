console.log("map.js loaded");

// ---------------- MAP INIT ----------------
const map = L.map("map", {
  doubleClickZoom: false   // IMPORTANT
}).setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ---------------- NAME MAP ----------------
const countryNameMap = {
  "Japan": "Japan",
  "United Kingdom": "United Kingdom",
  "Germany": "Germany",
  "France": "France",
  "United States of America": "USA"
};

// ---------------- LOAD COUNTRIES ----------------
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(res => res.json())
  .then(geo => {

    console.log("GeoJSON loaded");

    const geoLayer = L.geoJSON(geo, {
      interactive: true, // 🔥 CRITICAL

      style: feature => {
        const mapped = countryNameMap[feature.properties.name];

        if (mapped && countryData[mapped]) {
          return {
            fillColor: countryData[mapped].priority ? "#f4a3c4" : "#b7d7e8",
            fillOpacity: 0.8,
            color: "#222",
            weight: 1
          };
        }

        return {
          fillColor: "#eeeeee",
          fillOpacity: 0.3,
          color: "#cccccc",
          weight: 0.5
        };
      },

      onEachFeature: (feature, layer) => {
        const mapped = countryNameMap[feature.properties.name];

        if (mapped && countryData[mapped]) {

          // bring layer above map
          layer.bringToFront();

          layer.on("click", e => {
            console.log("Clicked:", mapped);

            const d = countryData[mapped];
            const s = d.scores;

            let html = `
              <div style="min-width:240px">
                <strong>${mapped}</strong><br/>
            `;

            if (d.priority) {
              html += `<span style="color:#c2185b">${d.priorityRank}</span><br/>`;
            }

            html += `
              <b>Total Score:</b> ${d.finalScore}/100
              <hr/>
              Demand: ${s.demandReadiness}/10<br/>
              Trade: ${s.economicTrade}/10<br/>
              Brand Fit: ${s.brandCulturalFit}/10<br/>
              Growth: ${s.premiumGrowth}/10<br/>
              Logistics: ${s.logistics}/10<br/>
              Stability: ${s.tradeStability}/10<br/>
              Duty Impact: ${s.dutyImpact}/10
              </div>
            `;

            L.popup({ closeButton: true })
              .setLatLng(e.latlng)
              .setContent(html)
              .openOn(map);
          });
        }
      }
    });

    geoLayer.addTo(map);
    geoLayer.bringToFront(); // 🔥 ensures click priority
  });
