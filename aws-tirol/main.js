let basemapGray = L.tileLayer.provider('BasemapAT.grau');

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
awsLayer.addTo(map);

fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten Konvertiert: ', json);
        for (station of json.features) {
        //console.log('Satation: ', station);
        let marker = L.marker(
            [station.geometry.coordinates[1],
            station.geometry.coordinates[0]] //marker hinzufügen mit eckige klammern für längen- und Breitnegrad
        );
        marker.bindPopup(`<h3>${station.properties.name}</h3>;
        <ul>
            <li>Datum: ${station.properties.date}
            <li>Temperature: ${station.properties.LT} C</li>
        </ul>
        `);
        marker.addTo(awsLayer);
    }

    //set map view to all stations
    map.fitBounds(awsLayer.getBounds());
});
