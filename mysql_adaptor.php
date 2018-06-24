<?php



function getConnection(){
	$servername = "localhost:8887";
	$username = "root";
	$password = "root";
	$dbname = "evac_game";
	
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	
	return $conn;
}

function insertUser($user){
	
	$conn = getConnection();
	
	$sql = "INSERT INTO user (age)
	VALUES ('$user->age')";
	
	if ($conn->query($sql) === TRUE) {
		$id = $conn->insert_id;
		$conn->close();
		return $id;
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close();
}

function retrieveUser($id){
	
	$conn = getConnection();
	
	$sql = "SELECT * FROM user WHERE id=$id";
	$result = $conn->query($sql);
	
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$conn->close();
			return new User($row["id"], $row["age"]);
		}
	} else {
		$conn->close();
		return null;
	}
}

?>