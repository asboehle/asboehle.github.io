let stop = {
    nr: 11,
    name: "Milford Sound",
    lat: -44.616667
    lng: 167.866667,
    user: "asboehle",
    wikipedia: "https://de.wikipedia.org/wiki/Milford_Sound"
};

console.log(stop);
console.log(stop.name);
console.log(stop.lat);
console.log(stop.lng);
console.log(stop.wikipedia);

const map = L.map("map", {
 center: [ -44.616667, 167.866667 ],
 zoom: 13,
 layers: [ L.tileLayers("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") ]}); 

let mrk =  L.marker ([-44.616667, 167.866667]).addTo(map); //marker definieren und karte hinzufügen
mrk.bindPopup("Milford Sound").openPopup(); //beschriftet marke, Popup feature geht immer nur auf einem Marker

//ID erstellen; L für Leaflet, []stehen für Lsiten
//console.log(document.querySelector("#map"));//documentquerySelector wenn wir aus einem Scirpt auf eine Karte zugreifen wollen

//cmd + i in Webseite um verwendete Medien anzusehen