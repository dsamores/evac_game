var MAP = {
	startLocation: [-37.799612, 144.963359],
	finishLocation: [-37.795416, 144.963928],
};


var mymap = L.map('mapid', {zoomControl: true, dragging: false}).setView([-37.796772, 144.963654], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw', {
    attribution: '',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw'
}).addTo(mymap);

var markerStart = L.marker(MAP.startLocation).addTo(mymap);
var markerFinish = L.marker(MAP.finishLocation).addTo(mymap);

navigator.geolocation.watchPosition(render);

function render(pos) {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    var circle = L.circle([lat, lon], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.5,
        radius: 20
    }).addTo(mymap);
}