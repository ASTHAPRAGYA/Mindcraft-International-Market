console.log("map.js loaded");

// ---- NAME NORMALIZATION ----
const countryNameMap = {
  "Japan": "Japan",
  "United Kingdom": "United Kingdom",
  "Germany": "Germany",
  "France": "France",
  "United States of America": "USA"
};

// ---- MAP INIT ----
const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ---- LOAD GEOJSON ----
fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(res => res.json())
  .then(geo => {

    console.log("GeoJSON loaded");

    L.geoJSON(geo, {

      style: feature => {
        const geoName = feature.properties.name;
        const mappedName = countryNameMap[geoName];

        if (mappedName && countryData[mappedName]) {
          return {
            fillColor: countryData[mappedName].priority
              ? "#f4a3c4"   // pink for top 3
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
        const geoName = feature.properties.name;
        const mappedName = countryNameMap[geoName];

        if (mappedName && countryData[mappedName]) {
          layer.on("click", e => {
            const d = countryData[mappedName];
            const s = d.scores;

            let popupHTML = `
              <div style="min-width:240px">
                <div style="font-size:16px;font-weight:bold;">
                  ${mappedName}
                </div>
            `;

            if (d.priority) {
              popupHTML += `
                <div style="color:#c2185b;font-weight:bold;">
                  ${d.priorityRank}
                </div>
              `;
            }

            popupHTML += `
              <div style="margin:6px 0;">
                <b>Total Market Score:</b>
                <span style="color:#c2185b">${d.finalScore}/100</span>
              </div>

              <hr/>

              <b>Parameter Scores</b><br/>
              Demand Readiness: ${s.demandReadiness}/10<br/>
              Economic & Trade: ${s.economicTrade}/10<br/>
              Brand & Cultural Fit: ${s.brandCulturalFit}/10<br/>
              Premium Growth: ${s.premiumGrowth}/10<br/>
              Logistics: ${s.logistics}/10<br/>
              Trade Stability: ${s.tradeStability}/10<br/>
              Duty Impact (Inverse): ${s.dutyImpact}/10
              </div>
            `;

            L.popup()
              .setLatLng(e.latlng)
              .setContent(popupHTML)
              .openOn(map);
          });
        }
      }
    }).addTo(map);
  });
