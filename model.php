<?php
require 'mysql_adaptor.php';

require_once('ShapeFile.lib.php');

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
	public $points;
	
	public function __construct($id, $name, $startLocation, $endLocation, $active, $points) {
		$this->id = $id;
		$this->name = $name;
		$this->startLocation = $startLocation;
		$this->endLocation = $endLocation;
		$this->active = $active;
		$this->points= $points;
	}
	
	public static function getActiveGame($userId, $time){
		$activeGame = MySQLAdaptor::retrieveActiveGame($userId);
		
		$startInteraction = new Interaction(null, $userId, $activeGame->id, null, 'start', $time, $activeGame->startLocation[0], $activeGame->startLocation[1]);
		$startInteraction->save();
		
		return $activeGame;
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
	public $latitude;
	public $longitude;
	
	public function __construct($id, $userId, $gameId, $bubbleId, $type, $time, $latitude, $longitude) {
		$this->id = $id;
		$this->userId= $userId;
		$this->gameId= $gameId;
		$this->bubbleId= $bubbleId;
		$this->type= $type;
		$this->time= $time;
		$this->latitude= $latitude;
		$this->longitude= $longitude;
	}
	
	public function save(){
		return MySQLAdaptor::insertInteraction($this);
	}
	
	public static function storeInteractions($rawInteractions, $userId, $gameId){
		$success = true;
		foreach($rawInteractions as $rawInteraction){
			$interaction = new Interaction(
				null, $userId, $gameId, $rawInteraction->bubbleId,
				$rawInteraction->type, $rawInteraction->time,
				$rawInteraction->latitude, $rawInteraction->longitude
			);
			$success &= $interaction->save();
		}
		return $success;
	}
	
	public static function createShapefile($userId, $gameId){
		$interactions = MySQLAdaptor::retrieveInteractions($userId, $gameId);
		$geojson = array(
				'type'      => 'FeatureCollection',
				'features'  => array()
		);
		foreach ($interactions as $interaction){
			$feature = array(
					'type' => 'Feature',
					'geometry' => array(
							'type' => 'Point',
							'coordinates' => array(floatval($interaction->longitude), floatval($interaction->latitude))
					),
					'properties' => array(
							'type' => $interaction->type,
					)
			);
			array_push($geojson['features'], $feature);
		}
		return $geojson;
	}
}
