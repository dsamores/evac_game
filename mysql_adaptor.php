<?php

class MySQLAdaptor{

	public static function getConnection(){
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
	
	public static function insertUser($user){
		
		$conn = MySQLAdaptor::getConnection();
		
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
	
	public static function retrieveUser($id){
		
		$conn = MySQLAdaptor::getConnection();
		
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
	
	public static function retrieveActiveGame(){
		
		$conn = MySQLAdaptor::getConnection();
		
		$sql = "SELECT * FROM game WHERE active=1";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$conn->close();
				$startLocation = explode(',', $row["startLocation"]);
				$endLocation= explode(',', $row["endLocation"]);
				return new Game($row["id"], $row["name"], $startLocation, $endLocation, $row["active"]);
			}
		} else {
			$conn->close();
			return null;
		}
	}
	
	public static function insertInteraction($interaction){
		
		$conn = MySQLAdaptor::getConnection();
		
		$bubbleId = $interaction->bubbleId ? $interaction->bubbleId : 'null';
		
		$sql = "INSERT INTO interaction (userId, gameId, bubbleId, type, time)
		VALUES ($interaction->userId, $interaction->gameId, $bubbleId, '$interaction->type', '$interaction->time')";
		
		if ($conn->query($sql) === TRUE) {
			$conn->close();
			return true;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
			$conn->close();
			return false;
		}
	}
	
	public static function insertBubble($bubble){
		
		$conn = MySQLAdaptor::getConnection();
		
		$sql = "INSERT INTO bubble (id, userId, gameId, type, time)
		VALUES ($bubble->id, $bubble->userId, $bubble->gameId, '$bubble->type', '$bubble->time')";
		
		if ($conn->query($sql) === TRUE) {
			$conn->close();
			return true;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
			$conn->close();
			return false;
		}
	}
}

?>