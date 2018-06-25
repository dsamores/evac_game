<?php

require 'model.php';

function getUser($id=-1){
	if($id == -1){
		$user = new User(17);
	}
	else{
		$user = User::getUser($id);
	}
	return $user;
}

function getActiveGame(){
	return Game::getActiveGame();
}

function createShapeFile($userId, $gameId){
	return Interaction::createShapeFile($userId, $gameId);
}

header('Content-type: application/json');
$request = htmlspecialchars($_GET["request"]);

switch ($request){
	case 'new_user':
		echo json_encode(getUser());
		break;
	case 'user':
		echo json_encode(getUser($_POST["userId"]));
		break;
	case 'new_game':
		echo json_encode(getActiveGame());
		break;
	case 'get_shapefile':
		echo json_encode(createShapeFile($_GET["user_id"], $_GET["game_id"]));
		break;
	default:
		echo 'qwerty';
		break;
}