var mymap = L.map('mapid', {zoomControl: true, dragging: false}).setView([-37.796772, 144.963654], 15);

//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//    maxZoom: 18
//}).addTo(mymap);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw', {
    attribution: 'David &hearts;\'s  &copy;',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw'
}).addTo(mymap);

function addMarkers(){
	var markerStart = L.marker(GAME.startLocation).addTo(mymap);
	var markerFinish = L.marker(GAME.finishLocation).addTo(mymap);
}

var marker = null;

mymap.on("locationfound", function(location) {
    if (!marker)
        marker = L.userMarker(location.latlng, {pulsing:true, accuracy:30, smallIcon:true}).addTo(mymap);
    
    marker.setLatLng(location.latlng);
    marker.setAccuracy(location.accuracy);

    USER.currentLat = location.latlng.lat;
    USER.currentLon = location.latlng.lng;
    
	var distance = distanceBetweenCoords(location.latlng.lat, location.latlng.lng, GAME.finishLocation[0], GAME.finishLocation[1]);
	if (distance < 10){
		finishGame();
	}
    
});

mymap.locate({
    watch: true,
    setView: false,
    enableHighAccuracy: true
});