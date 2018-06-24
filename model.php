<?php
require 'mysql_adaptor.php';

class User {
	public $id;
	public $age;
	
	public function __construct($age=-1) {
		$this->age = $age;
		$this->id = $this->create();
	}
	
	public function create(){
		return MySQLAdaptor::insertUser($this);
	}
	
	public static function getUser($id){
		return MySQLAdaptor::retrieveUser($id);
	}
}

class Game {
	public $id;
	public $name;
	public $startLocation;
	public $endLocation;
	public $active;
	
	public function __construct($id, $name, $startLocation, $endLocation, $active) {
		$this->id = $id;
		$this->name = $name;
		$this->startLocation = $startLocation;
		$this->endLocation = $endLocation;
		$this->active = $active;
	}
	
	public static function getActiveGame(){
		return MySQLAdaptor::retrieveActiveGame();
	}
	
}

class Bubble {
	public $id;
	public $userId;
	public $gameId;
	public $type;
	public $time;
	
	public function __construct($id, $userId, $gameId, $type, $time) {
		$this->id = $id;
		$this->userId= $userId;
		$this->gameId= $gameId;
		$this->type= $type;
		$this->time= $time;
	}
	
	public function save(){
		return MySQLAdaptor::insertBubble($this);
	}
	
	public static function storeBubbles($rawBubbles, $userId, $gameId){
		$success = true;
		foreach($rawBubbles as $rawBubble){
			$bubble = new Bubble(
					$rawBubble->id, $userId, $gameId,
					$rawBubble->type, $rawBubble->time
					);
			$success &= $bubble->save();
		}
		return $success;
	}
}

class Interaction {
	public $id;
	public $userId;
	public $gameId;
	public $bubbleId;
	public $type;
	public $time;
	
	public function __construct($id, $userId, $gameId, $bubbleId, $type, $time) {
		$this->id = $id;
		$this->userId= $userId;
		$this->gameId= $gameId;
		$this->bubbleId= $bubbleId;
		$this->type= $type;
		$this->time= $time;
	}
	
	public function save(){
		return MySQLAdaptor::insertInteraction($this);
	}
	
	public static function storeInteractions($rawInteractions, $userId, $gameId){
		$success = true;
		foreach($rawInteractions as $rawInteraction){
			$interaction = new Interaction(
					null, $userId, $gameId,
					$rawInteraction->bubbleId, $rawInteraction->type, $rawInteraction->time
					);
			$success &= $interaction->save();
		}
		return $success;
	}
}
