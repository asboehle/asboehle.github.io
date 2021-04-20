let basemapGray = L.tileLayer.provider('BasemapAT.grau'); //Provider erleichtert ohne ganzen links kopieren zu müssen

let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");
//awsLayer.addTo(map);

let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen (cm)");
//snowLayer.addTo(map);

let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit (km/h)");
//windLayer.addTo(map);

let temperatureLayer = L.featureGroup ();
layerControl.addOverlay(temperatureLayer, "Temperatur (°C)");
//temperatureLayer.addTo(map);

fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten Konvertiert: ', json);
        for (station of json.features) {
        //console.log('Satation: ', station);

        //https://leafletjs.com/reference-1.7.1.html#layer 
        let marker = L.marker([
            station.geometry.coordinates[1],
            station.geometry.coordinates[0]] //marker hinzufügen mit eckige klammern für längen- und Breitnegrad
        );
        let formattedDate = new Date(station.properties.date);
        marker.bindPopup(`
        <h3>${station.properties.name}</h3>
        <ul>
          <li>Datum: ${formattedDate.toLocaleString("de")}</li>
          <li>Stationshöhe: ${sation.geometry.coordinates[2]} m</li>;
          <li>Temperatur: ${station.properties.LT} °C</li>
          <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
          <li>Luftfeuchte: ${station.properties.RH} </li>
          <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>;
          <li>Windrichtung: ${station.properties.WR || '?'}</li>

        </ul>
        <a target = "_blak" href ="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
        `);

    
        marker.addTo(awsLayer);
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);
            }
            if (station.properties.WG) {
                let windHighlightClass = '';
                if (station.properties.WG > 10) {
                    windHighlightClass = 'wind-10';
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = 'wind-20';
                }
                let windIcon = L.divIcon({
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`,
                });
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }
            if (station.properties.LT) {
                let temperatureHighlightClass = '';
                if (station.properties.LT >= 0) {
                    temperatureHighlightClass = 'positive-temp';
                }
                if (station.properties.LT < 0) {
                    temperatureHighlightClass = 'negative-temp';
                }
                let temperatureIcon = L.divIcon({
                    html: `<div class="temperature-label ${temperatureHighlightClass}">${station.properties.LT}</div>`,
                });
                let temperatureMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: temperatureIcon
                });
                temperatureMarker.addTo(tempLayer);
            }
        }

    // Task: Windgeschiwndikeit mit Marker einfügen
    //set map view to all stations
    map.fitBounds(awsLayer.getBounds());
});

// Karte von leaflet http://leaflet-extras.github.io/leaflet-providers/preview/#filter=BasemapAT.orthofoto 
// Stationsdaten https://www.data.gv.at/katalog/dataset/bb43170b-30fb-48aa-893f-51c60d27056f 