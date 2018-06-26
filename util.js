function enableStart(){
	navigator.geolocation.getCurrentPosition(checkStartLocation);

	mymap.locate({
	    watch: true,
	    setView: false,
	    enableHighAccuracy: true
	});
}

function checkStartLocation(position){
	if(USER.mockLocation){
	    USER.currentLat = GAME.startLocation[0];
	    USER.currentLon = GAME.startLocation[1];
	}
	else{
	    USER.currentLat = position.coords.latitude;
	    USER.currentLon = position.coords.longitude;
	}
	
	var distance = distanceBetweenCoords(USER.currentLat, USER.currentLon, GAME.startLocation[0], GAME.startLocation[1]);
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
	USER.init();
	GAME.init();
	GAME.stop = false;
	POP.entities = [];
	
	var postGamePage = document.getElementById('post-game');
	var preGamePage = document.getElementById('pre-game');

	postGamePage.style.display = 'none';
	preGamePage.style.display = 'block';
}

function nextGame(){
	var preGamePage = document.getElementById('pre-game');
	var gamePage = document.getElementById('game');

	preGamePage.style.display = 'none';
	gamePage.style.display = 'block';
	
    mymap.invalidateSize();
    GAME.clearInfo();
    POP.loop();
}

function hideBubbles(){
	var hideButton = document.getElementById('hideBubbles');
	if(hideButton.value == 1){
		hideButton.src = 'images/binoculargrey.png';
		hideButton.value = 0;
		for (i = 0; i < POP.entities.length; i += 1) {
            if (POP.entities[i].type === 'bubble') {
            	POP.entities[i].remove = true;
            }
        }
		clearInterval(bubbleTimer);
	}
	else{
		hideButton.src = 'images/binoculars.png';
		hideButton.value = 1;
		bubbleTimer = setInterval(function(){
			GAME.showBubble = true;
		}, 3000);
	}
}

function checkText() {
	var txt = $('#writeText').val();
    if (txt != null && txt != "") {
    	console.log("+10 points for you");
		USER.points += GAME.points.writeText;
		POP.Score.setNewPoints(GAME.points.writeText, true);
		$('#writeTextModal').modal('toggle');
    }
    else{
    	console.log("No points for you");
    }
}

$('#takePiccie').change(function() {
	USER.points += GAME.points.takePicture;
	POP.Score.setNewPoints(GAME.points.takePicture, true);
	$('#cameraModal').modal('toggle');
});

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