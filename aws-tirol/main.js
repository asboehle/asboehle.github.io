let basemapGrey = L.titleLayer.provider ()

let map = L.map ("map"; {
    cener: [24, 11],
    zoom: 9,
    layers: [
        basemapGrey
    ]
});
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGrey,
    "BasemapAT.ortofoto": L.titleLayer.provider('BasemapAT')

}). addTo(map);