const map = L.map("map", {
 center: [ -44.616667, 167.866667 ],
 zoom: 13,
 layers: [ L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") ]
}); 

let mrk =  L.marker ([-44.616667, 167.866667]).addTo(map);

//ID erstellen; L für Leaflet, []stehen für Lsiten
console.log(document.querySelector("#map"));//documentquerySelector wenn wir aus einem Scirpt auf eine Karte zugreifen wollen

//cmd + i in Webseite um verwendete Medien anzusehen