// OGD-Wien Beispiel

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
// MarkerCluster bei Sehenswürdigkeiten
let overlays = {
    busLines: L.featureGroup(),
    busStops: L.featureGroup(),
    pedAreas: L.featureGroup(),
    attractions: L.markerClusterGroup(), 
};

// Karte initialisieren und auf Wiens Wikipedia Koordinate blicken
//fullscreen einbauen
let map = L.map("map", {
    fullscreenControl: true,
    center: [48.208333, 16.373056],
    zoom: 13,
    layers: [
        baselayers.grau
    ]
});

// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "basemap.at Standard": baselayers.standard,
    "basemap.at grau": baselayers.grau,
    "basemap.at Relief": baselayers.terrain,
    "basemap.at Oberfläche": baselayers.surface,
    "basemap.at hochauflösend": baselayers.highdpi,
    "basemap.at Orthofoto beschriftet": baselayers.ortho_overlay
}, {
    "Liniennetz Vienna Sightseeing": overlays.busLines,
    "Haltestellen Vienna Sightseeing": overlays.busStops,
    "Fußgängerzonen": overlays.pedAreas,
    "Sehenswürdigkeiten": overlays.attractions
}).addTo(map);

// alle Overlays nach dem Laden anzeigen
overlays.busLines.addTo(map);
overlays.busStops.addTo(map);
overlays.pedAreas.addTo(map);
overlays.attractions.addTo(map);

//funktion definieren
let drawBusStop = (geojsonData) => {
    L.geoJson (geojsonData, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            Station: ${feature.properties.STAT_NAME}`)
        },
        pointToLayer: (geoJsonPoint, latlng) => {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/busstop.png',
                    iconSize: [38, 38]
                })
            })
        },
       
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien</a> - <a href="https://mapicons.mapsmarker.com">Maps Icons Collection</a>'
    }).addTo(overlays.busStops);
}

let drawBusLines = (geojsonData) => {
    console.log('Bus Lines: ', geojsonData);
    L.geoJson(geojsonData, {
        style: (feature) => {
            let col = "red";
            col = COLORS.buslines
            [feature.properties.LINE_NAME]; //verkürzte Schreibweise
//            if (feature.properties.LINE_NAME == 'Blue Line') {
//                col = COLORS.busLines ["Blue Line"];
//            }
//            if (feature.properties.LINE_NAME == 'Orange Line') {
//                col = COLORS.busLines ["Orange Line"];
//            }
//            if (feature.properties.LINE_NAME == 'Grey Line') {
//                col = COLORS.busLines ["Grey Line"];
//            }
//            if (feature.properties.LINE_NAME == 'Yellow Line') {
//                col = COLORS.busLines ["Yellow Line"];
//           }
            return {
                color: col
            }
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            von ${feature.properties.FROM_NAME}<br>
            nach ${feature.properties.TO_NAME}`)
        },
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien</a>'
    }).addTo(overlays.busLines);
}

let drawPedAreas = (geojsonData) => {
    console.log('Zone: ', geojsonData);
    L.geoJson(geojsonData, {
        style: (feature) => {
            return {
                stroke: true,
                color: "silver",
                fillColor: "yellow",
                fillOpacity: 0.3,
            }
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong> Fußgängerzone ${feature.properties.ADRESSE}</strong>
            <hr>
            ${feature.properties.ZEITRAUM || ""} <br>
            ${feature.properties.AUSN_TEXT || ""}
            `);
        },
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien</a>'
    }).addTo(overlays.pedAreas);
}

let drawAttractions = (geojsonData) => {
    L.geoJson(geojsonData, {
    onEachFeature: (feature, layer) => {
        layer.bindPopup(`<strong>${feature.properties.NAME}</strong>
        <hr>
        Adresse: ${feature.properties.ADRESSE}<br>
        <a href="${feature.properties.WEITERE_INF}">Weblink</a>
    `)
},
    pointToLayer: (geoJsonPoint, latlng) => {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: 'icons/attraction.png',
                iconSize: [38, 38]
            })
        })
    },
    attribution: '<a href="https://data.wien.gv.at">Stadt Wien</a>'

}).addTo(overlays.attractions);

}
//fetch("data/TOURISTICHSTVSLOGD.json")
// .then(response => response.json())
// .then(stations => {
//    L.geoJson(stations, {
//        onEachFeature: (feature, layer) => {
//            layer.bindPopup(feature.properties.STAT_NAME)
//        },
//        pointToLayer: (geoJsonPoint, latlng) => {
//            return L.marker(latlng, {
//                icon: L.icon({
//                   iconUrl: 'icons/busstop.png',
//                    iconSize: [38, 38]
//                })
//            })
//        }
//    }).addTO(map);
//});

for (let config of OGDWIEN) {
    console.log("Config: ", config.data);
    fetch(config.data)
    .then(response => response.json())
    .then(geojsonData => {
        //console.log("Data: ", geojsonData);
        if (config.title == "Haltestellen Vienna Sightseeing") {
            drawBusStop(geojsonData);
        }
        else if (config.title == "Liniennetz Vienna Sightseeing") {
            drawBusLines(geojsonData);
        }
        else if (config.title == "Fußgängerzonen") {
            drawPedAreas(geojsonData);
        }
        else if (config.title == "Sehenswürdigkeiten") {
            drawAttractions(geojsonData);
        }
    })
}

//Datenursprung:
//https://www.data.gv.at/katalog/dataset/f4e80988-c139-4953-8176-b3d6d03f6449 

//Icon Ursprung:
https://mapicons.mapsmarker.com/markers/transportation/road-transportation/bus-stop/?custom_color=509c55
// leaflet hash
//var hash = new L.hash(map) aber kurz:
L.hash(map);

//Minimap einfügen
var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
    toggleDisplay: true,
    minimized: false,
}).addTo(map)

//Reachability Plugin

let styleIntervals = (feature) => {
    let color = "";
    //console.log(feature);
    //console.log(feature.properties.Measure);
    let range = feature.properties.Range;
    if (feature.properties.Measure === "time") {
        color = COLORS.minutes[range];
    } else if (feature.properties.Measure === "distance") {
        color = COLORS.kilometers[range];
    } else {
        color = "black";
    }
    return {
        color: color,
        opacity: 0.5,
        fillOpacity: 0.2
    };
};

L.control.reachability({
    // Mein API: 5b3ce3597851110001cf62486f4d81186e8544b9816dfb7647e12511
    apiKey: '5b3ce3597851110001cf62486f4d81186e8544b9816dfb7647e12511',
    styleFN: styleIntervals,
    drawButtonContent: '',
    drawButtonStyleClass: 'fa fa-pencil-alt fa-2x',
    deleteButtonContent: '',
    deleteButtonStyleClass: 'fa fa-trash fa-2x',
    distanceButtonContent: '',
    distanceButtonStyleClass: 'fa fa-road fa-2x',
    timeButtonContent: '',
    timeButtonStyleClass: 'fa fa-clock fa-2x',
    travelModeButton1Content: '',
    travelModeButton1StyleClass: 'fa fa-car fa-2x',
    travelModeButton2Content: '',
    travelModeButton2StyleClass: 'fa fa-bicycle fa-2x',
    travelModeButton3Content: '',
    travelModeButton3StyleClass: 'fa fa-male fa-2x',
    travelModeButton4Content: '',
    travelModeButton4StyleClass: 'fa fa-wheelchair fa-2x'
}).addTo(map);

// Farbpaletten: https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3 
//icons für reachability: https://fontawesome.com/v4.7.0/icon/pencil 