let stop = {
    nr: 11,
    name: "Milford Sound",
    lat: -44.616667,
    lng: 167.866667,
    user: "asboehle",
    wikipedia: "https://de.wikipedia.org/wiki/Milford_Sound"
}


const map = L.map("map", {
    center: [ -44.616667, 167.866667 ],
    zoom: 13,
    fullscreenControl: true,
    layers: [L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")]
});

//Minimap einfügen
var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
    toggleDisplay: true,
    minimized: false,

}).addTo(map);



let nav = document.querySelector('#navigation');
console.log('Naivation HTML Element: ', nav);
//console.log(ROUTE);

ROUTE.sort((stop1, stop2) => {
    if (stop1.nr > stop2.nr) {
        return 1;
    } else {
        return -1;
    }
});


//nach nummer sortieren aaufsteigend;

for (let entry of ROUTE) {
    //console.log(entry);

    nav.innerHTML += `<option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>`;
    let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
    mrk.bindPopup(`<h4>Stop ${entry.nr}: ${entry.name}<h4>
   <p><a href="${entry.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
   `);

    if (entry.nr == 11) {
        map.setView([entry.lat, entry.lng], 13);
        mrk.openPopup();
    }
}

nav.selectedIndex = 11-1;
nav.onchange = (evt) => {
    console.log(evt.target.selectedIndex);
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username = options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`;
    window.location.href = link;
    console.log(link);
}

console.log(document.querySelector("#map"));

//beschriftet marke, Popup feature geht immer nur auf einem Marker

//ID erstellen; L für Leaflet, []stehen für Lsiten
//console.log(document.querySelector("#map"));//documentquerySelector wenn wir aus einem Scirpt auf eine Karte zugreifen wollen

//cmd + i in Webseite um verwendete Medien anzusehen
//<option value="asboehle">Milford Sound</option>