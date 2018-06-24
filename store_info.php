<?php

require 'model.php';

function storeInteractions($data){
	$interactions = $data->interactions;
	$userId = $data->userId;
	$gameId = $data->gameId;
	return Interaction::storeInteractions($interactions, $userId, $gameId);
}

$request = htmlspecialchars($_GET["request"]);
header('Content-type: application/json');

$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody);

switch ($request){
	case 'interactions':
		var_dump($data);
		if(storeInteractions($data))
			echo 'interactions stored';
		else
			echo 'Error!';
			break;
	default:
		echo 'qwerty';
		break;
}