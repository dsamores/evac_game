function requestFromServer(type) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	if(type == 'new_user'){
	    	var userInfo = JSON.parse(this.responseText);
	    	USER.id = userInfo.id;
	    	USER.storeInfo();
	    	Game.init();
    	}
    	else if(type == 'new_game'){
    		var startButton = document.getElementById('start');
    		startButton.style.display = 'none';
    		var gameInfo = JSON.parse(this.responseText);
    		if(gameInfo){
	    		GAME.id = parseInt(gameInfo.id);
	    		GAME.name = gameInfo.name;
	    		USER.points = gameInfo.points;
    			USER.mockLocation = false;
	    		if(GAME.name.startsWith("DEMO")){
	    			USER.mockLocation = true;
	    			USER.simulateLocation();
	    		}
	    		GAME.startLocation = gameInfo.startLocation;
	    		GAME.finishLocation = gameInfo.endLocation;
	    		addMarkers();
	    		enableStart();
    		}
    	}
    }
  };
  var currentTime = new Date().getTime();
  var otherParams = type == 'new_game' ? '&user_id=' + USER.id + '&time=' + currentTime : '';
  xhttp.open("GET", "get_info.php?request=" + type + otherParams, true);
  xhttp.send();
}

function sendToServer(type, data) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	console.log('success:' + this.responseText);
    }
  };
  xhttp.open("POST", "store_info.php?request=" + type, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(data);
}