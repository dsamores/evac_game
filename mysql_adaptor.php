<?php

class MySQLAdaptor{

	public static function getConnection(){
		$prod = false;
		if($prod){
			$servername = "localhost";
			$username = "hchen";
			$password = "ahxoh3uP";
			$dbname = "evac_game";
		}
		else{
			$servername = "localhost:8887";
			$username = "root";
			$password = "root";
			$dbname = "evac_game";
		}
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
	
	public static function retrieveActiveGame($userId){
		
		$conn = MySQLAdaptor::getConnection();
		
		$sql = "SELECT * FROM game AS g WHERE active=1 AND $userId NOT IN (SELECT userId FROM interaction WHERE gameId = g.id AND type='start') ORDER BY id";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$conn->close();
				$startLocation = explode(',', $row["startLocation"]);
				$endLocation= explode(',', $row["endLocation"]);
				return new Game($row["id"], $row["name"], $startLocation, $endLocation, $row["active"], $row["points"]);
			}
		} else {
			$conn->close();
			return null;
		}
	}
	
	public static function insertInteraction($interaction){
		
		$conn = MySQLAdaptor::getConnection();
		
		$bubbleId = $interaction->bubbleId ? $interaction->bubbleId : 'null';
		
		$sql = "INSERT INTO interaction (userId, gameId, bubbleId, type, time, latitude, longitude)
		VALUES ($interaction->userId, $interaction->gameId, $bubbleId, '$interaction->type', '$interaction->time', $interaction->latitude, $interaction->longitude)";
		
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
	
	public static function retrieveInteractions($userId, $gameId){
		$conn = MySQLAdaptor::getConnection();
		
		$sql = "SELECT * FROM interaction WHERE userId=$userId AND gameId=$gameId";
		$result = $conn->query($sql);
		$interactions = [];
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$conn->close();
				array_push($interactions, new Interaction(
						$row["id"], $row["userId"], $row["gameId"], $row["bubbleId"], 
						$row["type"], $row["time"], $row["latitude"], $row["longitude"]
					)
				);
			}
		} else {
			$conn->close();
		}
		return $interactions;
	}
}

?>