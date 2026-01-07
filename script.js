const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
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
          layer.on("click", () => {
            const d = countryData[name];
            layer.bindPopup(`
              <b>${name}</b><br/><br/>

              <b>KYLR Market Attractiveness Score:</b>
              <span style="font-size:16px; color:#c2185b;">
                ${d.finalScore} / 100
              </span>
              <br/><br/>

              <b>FTA / Trade:</b> ${d.fta}<br/>
              <b>Duty Trend:</b> ${d.duty}<br/>
              <b>Trade Stability:</b> ${d.trade}<br/>
              <b>Logistics:</b> ${d.logistics}<br/>
              <b>Demand Readiness:</b> ${d.demand}<br/>
              <b>Economic Value:</b> ${d.economic}<br/>
              <b>Brand & Cultural Fit:</b> ${d.brand}<br/>
              <b>Premium Growth & Pricing Power:</b> ${d.premium}
            `).openPopup();
          });
        }
      }
    }).addTo(map);
  });
