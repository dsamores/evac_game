function enableStart(){
	navigator.geolocation.getCurrentPosition(checkStartLocation);
}

function checkStartLocation(position){
	var distance = distanceBetweenCoords(position.coords.latitude, position.coords.longitude, GAME.startLocation[0], GAME.startLocation[1]);
	if(distance < 25){
		var startButton = document.getElementById('start');
		startButton.style.display = 'inline-block';
		
		var placeholderDiv = document.getElementById('placeholder');
		placeholderDiv.style.display = 'none';
	}
	else{
		var placeholderDiv = document.getElementById('placeholder');
		placeholderDiv.innerHTML = "Not within start location range";
//		console.log(position.coords);
//		console.log(GAME.startLocation);
//		console.log(distance);
	}
}

function startGame(){
	var preGamePage = document.getElementById('pre-game');
	var gamePage = document.getElementById('game');

	preGamePage.style.display = 'none';
	gamePage.style.display = 'block';
    mymap.invalidateSize();
    POP.loop();
}

function finishGame(){
	GAME.stop = true;
	USER.sendBubbles();
	USER.sendInteractions();
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceBetweenCoords(lat1, lon1, lat2, lon2) {
  var earthRadiusM = 6371000;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusM * c;
}