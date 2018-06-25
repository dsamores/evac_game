function requestFromServer(type) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	if(type == 'new_user'){
	    	var userInfo = JSON.parse(this.responseText);
	    	USER.id = userInfo.id;
    	}
    	else if(type == 'new_game'){
    		var gameInfo = JSON.parse(this.responseText);
    		if(gameInfo){
	    		GAME.id = parseInt(gameInfo.id);
	    		GAME.startLocation = gameInfo.startLocation;
	    		GAME.finishLocation = gameInfo.endLocation;
	    		addMarkers();
	    		enableStart();
    		}
    	}
    }
  };
  xhttp.open("GET", "get_info.php?request=" + type, true);
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