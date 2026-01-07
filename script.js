const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(res => res.json())
  .then(data => {

    function styleFeature(feature) {
      const name = feature.properties.name;
      if (countryData[name]) {
        return {
          color: "#333",
          weight: 1,
          fillOpacity: 0.75,
          fillColor: countryData[name].priority ? "#f4a3c4" : "#b7d7e8"
        };
      }
      return {
        color: "#ccc",
        weight: 0.5,
        fillOpacity: 0.2,
        fillColor: "#eee"
      };
    }

    L.geoJSON(data, {
      style: styleFeature,
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;

        if (countryData[name]) {
          layer.on("click", (e) => {
            const d = countryData[name];
            const s = d.scores;

            const priorityLine = d.priority
              ? `<div style="color:#c2185b; font-weight:bold;">${d.priorityRank}</div>`
              : "";

            const popupContent = `
              <div style="min-width:220px">
                <div style="font-size:16px; font-weight:bold;">
                  ${name}
                </div>

                ${priorityLine}

                <div style="margin:6px 0; font-size:15px;">
                  <b>Total Market Score:</b>
                  <span style="color:#c2185b">${d.finalScore} / 100</span>
                </div>

                <hr/>

                <b>Parameter Scores</b><br/>
                Demand Readiness: ${s.demandReadiness}/10<br/>
                Economic & Trade Viability: ${s.economicTrade}/10<br/>
                Brand & Cultural Fit: ${s.brandCulturalFit}/10<br/>
                Premium Growth & Pricing Power: ${s.premiumGrowth}/10<br/>
                Logistics Reliability: ${s.logistics}/10<br/>
                Trade Stability: ${s.tradeStability}/10<br/>
                Duty Impact (Inverse): ${s.dutyImpact}/10
              </div>
            `;

            L.popup({ closeButton: true })
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(map);
          });
        }
      }
    }).addTo(map);
  });
