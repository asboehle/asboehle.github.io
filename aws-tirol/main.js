//https://leafletjs.com/reference-1.7.1.html#tilelayer 
let basemapGray = L.tileLayer.provider('BasemapAT.grau'); //Provider erleichtert ohne ganzen links kopieren zu müssen

//https://leafletjs.com/reference-1.7.1.html#map-example 
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let overlays = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    snowhight: L.featureGroup(),
    windspeed: L.featureGroup(),
    winddirection: L.featureGroup(),
};


//https://leafletjs.com/reference-1.7.1.html#control
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Schneehöhe (cm)": overlays.snowhight,
    "Windgeschwindigkeit (km/h)": overlays.windspeed

}, {
    collapsed: false
}).addTo(map);

overlays.temperature.addTo(map);

//Maßstab einbauen

L.control.scale({
    imperial: false
}).addTo(map);

let newLabel = (coords, options) => {
    let label = L.divIcon({
        html: `<div>${options.value}</div>`,
        className:"text-label"
    })
    
    let marker = L.marker([coords[1], coords[0]], {
        icon: label
    });
   //console.log("Marker:", marker);
    return marker;
};

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

fetch(awsUrl) //wenn Inhalt von Webseite gezogen wird
    .then(response => response.json())
    .then(json => {
        console.log('Daten Konvertiert: ', json);
        for (station of json.features) {
            //console.log('Station: ', station);

            //https://leafletjs.com/reference-1.7.1.html#marker 
            let marker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ] //marker hinzufügen mit eckige klammern für längen- und Breitnegrad
            );
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
        <h3>${station.properties.name}</h3>
        <ul>
          <li>Datum: ${formattedDate.toLocaleString("de")}</li>
          <li>Stationshöhe: ${station.geometry.coordinates[2]} m</li>;
          <li>Temperatur: ${station.properties.LT} °C</li>
          <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
          <li>Luftfeuchte: ${station.properties.RH} </li>
          <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>;
          <li>Windrichtung: ${station.properties.WR || '?'}</li>

        </ul>
        <a target = "_blank" href ="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
        `);
            marker.addTo(overlays.stations);

            if (typeof station.properties.HS == "number") 
                let marker = newLabel(station.geometry.coordinates,{
                value: station.properties.HS
                }); 
                marker.addTo(overlays.snowhight);

            if (typeof station.properties.WG == "number") 
                let marker = newLabel(station.geometry.coordinates,{
                    value: station.properties.WG
                }); 
                marker.addTo(overlays.windspeed);

            if (typeof station.properties.LT == "number"){
                let marker = newLabel(station.geometry.coordinates,{
                    value: station.properties.LT
                }); 
                marker.addTo(overlays.temperature);

            }
        }


        //set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });
// Karte von leaflet http://leaflet-extras.github.io/leaflet-providers/preview/#filter=BasemapAT.orthofoto 
// Stationsdaten https://www.data.gv.at/katalog/dataset/bb43170b-30fb-48aa-893f-51c60d27056f 