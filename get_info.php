<?php

require 'model.php';

function getUser($id=-1){
	if($id == -1){
		$user = new User(17);
	}
	else{
		$user = User.getUser($id);
	}
	return $user;
}

function storeInteractions(){
	
}

$request = htmlspecialchars($_GET["request"]);
header('Content-type: application/json');

switch ($request){
	case 'new_user':
		echo json_encode(getUser());
		break;
	case 'user':
		echo json_encode(getUser($_POST["userId"]));
		break;
	case 'new_game':
		echo json_encode(getUser());
		break;
	case 'interactions':
		if(storeInteractions($_POST["interactions"]))
			echo 'success';
		break;
	default:
		echo 'qwerty';
		break;
}