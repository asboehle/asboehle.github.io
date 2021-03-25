let entry = {
    nr: 11,
    name: "Milford Sound",
    lat: -44.616667,
    lng: 167.866667,
    user: "asboehle",
    wikipedia: "https://de.wikipedia.org/wiki/Milford_Sound"
};


const map = L.map("map", {
 //center: [ -44.616667, 167.866667 ],
 //zoom: 13,
 layers: [ L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") ]}); 

 let nav = document.querySelector("#navigation");
 //console.log(nav)

 //console.log(ROUTE)
 ROUTE.sort((stop1, stop2) => {
    return stop1.nr > stop2.nr
});
 //nach nummer sortieren aaufsteigend

 for (let entry of ROUTE) {
     //console.log(entry);
 
     nav.innerHTML += `
     <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>
     `;

let mrk = L.marker([ entry.lat, entry.lng ]).addTo(map); //marker definieren und karte hinzufügen
mrk.bindPopup(`
    <h4>entry ${entry.nr}: ${entry.name}</h4>
    <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}"> Read about stop in wikpipedia</a></p>
    `);

    if (entry.nr == 11) {
        map.setView ([entry.lat, entry.lng], 13),
        mrk.openPopup ();
    }
}

nav.onchange = (evt) => {
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username =  options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`;
    console.log(username, link);

    window.location.href = link; 
};

//beschriftet marke, Popup feature geht immer nur auf einem Marker

//ID erstellen; L für Leaflet, []stehen für Lsiten
//console.log(document.querySelector("#map"));//documentquerySelector wenn wir aus einem Scirpt auf eine Karte zugreifen wollen

//cmd + i in Webseite um verwendete Medien anzusehen
//<option value="asboehle">Milford Sound</option>