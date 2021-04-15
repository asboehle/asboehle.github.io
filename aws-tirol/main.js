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
    "BasemapAT.surface": L.titleLayer.provider('BasemapAT.surface')
    "BasemapAT.overlay": L.titleLayer.provider('BasemapAT.overlay')
    "BasemapAT.overlay +ortho": L.layerGroup([
        L.titleLayer.provider ('BasemapAT.orthofoto'),
        L.titleLayer.provider ('BasemapAT.overlay')
    ])
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";
fetch(awsUrl).then(response => {
    console.log('Daten geladen', response.json());
})
