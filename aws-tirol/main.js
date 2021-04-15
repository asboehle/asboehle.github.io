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
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto')
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

fetch(awsUrl)
    .then(response => resoponse.json())
    .then(json => {
        console.log('Daten Konvertiert: ', json);
        for (station of json.features) {
        console.log('Satation: ', station);
        let marker = L.marker(
            [station.geometry.coodrinates[1],
            station.geometry.coodrinates[0]]
        );
        marker.addTo(map);
    }
});
