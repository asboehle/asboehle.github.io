/* global L */
// Bike Trail Tirol Beispiel

// Kartenhintergründe der basemap.at definieren
let baselayers = {
    standard: L.tileLayer.provider("BasemapAT.basemap"),
    grau: L.tileLayer.provider("BasemapAT.grau"),
    terrain: L.tileLayer.provider("BasemapAT.terrain"),
    surface: L.tileLayer.provider("BasemapAT.surface"),
    highdpi: L.tileLayer.provider("BasemapAT.highdpi"),
    ortho_overlay: L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ]),
};

// Overlays für die Themen zum Ein- und Ausschalten definieren
let overlays = {
    tracks: L.featureGroup()
};

// Karte initialisieren und auf Innsbrucks Wikipedia Koordinate blicken
let map = L.map("map", {
    center: [47.267222, 11.392778],
    zoom: 9,
    layers: [
        baselayers.grau
    ]
})
// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "basemap.at Standard": baselayers.standard,
    "basemap.at grau": baselayers.grau,
    "basemap.at Relief": baselayers.terrain,
    "basemap.at Oberfläche": baselayers.surface,
    "basemap.at hochauflösend": baselayers.highdpi,
    "basemap.at Orthofoto beschriftet": baselayers.ortho_overlay
}, {
    "GPX-Tracks": overlays.tracks
}).addTo(map);

// Overlay mit GPX-Track anzeigen
overlays.tracks.addTo(map);

//track 29 zeichnen
const drawTrack = (nr) => {
    console.log('Track: ', nr);
    let gpxTrack = new L.GPX(`tracks/${nr}.gpx`, {
        async: true, //veranlasst dass wartet bis komplette Datei geladen ist
        marker_options: {
            startIconUrl: `icons/number_${nr}.png`,
            endIconUrl: 'icons/finish.png',
            shadowUrl: null,
          },
          polyline_options: {
              color: 'black',
              dashArray: [2, 5], //gestichelte Linie 

          }
    }).addTo(overlays.tracks);
};

const selectedTrack = 29;
drawTrack(selectedTrack);