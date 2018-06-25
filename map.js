var mymap = L.map('mapid', {zoomControl: false, dragging: false}).setView([-37.796772, 144.963654], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw', {
    attribution: 'David &hearts;\'s  &copy;',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFtb3JlcyIsImEiOiJjamlwbDhmbjIweTNuM2tvNzhmOHMyMHc4In0.5J2Vqh0EG8gAVjEWGxnNBw'
}).addTo(mymap);

L.control.zoom({
    position:'bottomright'
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

    if(!USER.mockLocation){
        USER.currentLat = location.latlng.lat;
        USER.currentLon = location.latlng.lng;
    }
    
	var distance = distanceBetweenCoords(USER.currentLat, USER.currentLon, GAME.finishLocation[0], GAME.finishLocation[1]);
	if (distance < 10){
		finishGame();
	}
    
});

mymap.locate({
    watch: true,
    setView: false,
    enableHighAccuracy: true
});