<?php
require 'mysql_adaptor.php';

class User {
	public $id = true;
	public $age;
	
	public function __construct($age=-1) {
		$this->age = $age;
		$this->id = $this->create();
	}
	
	public function create(){
		return insertUser($this);
	}
	
	public static function getUser($id){
		return retrieveUser($id);
	}
}

