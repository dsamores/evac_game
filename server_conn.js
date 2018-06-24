function requestFromServer(type) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var userInfo = JSON.parse(this.responseText);
    	USER.id = userInfo.id;
    }
  };
  xhttp.open("GET", "get_info.php?request=" + type, true);
  xhttp.send();
}

function sendToServer(type, data) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	console.log('success');
    }
  };
  xhttp.open("POST", "store_info.php", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}