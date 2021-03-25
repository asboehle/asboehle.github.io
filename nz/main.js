let stop = {
    nr: 11,
    name: "Milford Sound",
    lat: -44.616667,
    lng: 167.866667,
    user: "asboehle",
    wikipedia: "https://de.wikipedia.org/wiki/Milford_Sound"
};

const map = L.map("map", {
 center: [ -44.616667, 167.866667 ],
 zoom: 13,
 layers: [ L.tileLayers("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") ]}); 

 console.log(ROUTE)
 for (let entry of ROUTE) {
     console.log(entry)
 
let mrk =  L.marker ([entry.lat, entry.lng]).addTo(map); //marker definieren und karte hinzufügen
mrk.bindPopup(`
    <h4>entry ${entry.nr}: ${entry.name}</h4>
    <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}"> Read about stop in wikpipedia</a></p>
    `).openPopup();
}

//beschriftet marke, Popup feature geht immer nur auf einem Marker

//ID erstellen; L für Leaflet, []stehen für Lsiten
//console.log(document.querySelector("#map"));//documentquerySelector wenn wir aus einem Scirpt auf eine Karte zugreifen wollen

//cmd + i in Webseite um verwendete Medien anzusehen