<?php
	include_once "mysql_config.php";
	
	class MySQLConnection {
		public $mysql;
		public $result;
		
		function __construct() {
			$this->mysql = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PASSWORD);
			$this->query("CREATE DATABASE IF NOT EXISTS ".MYSQL_DATABASE);
			$this->query("USE ".MYSQL_DATABASE);
			$this->query("CREATE TABLE IF NOT EXISTS @users(".
					"id INT NOT NULL AUTO_INCREMENT, ".
					"login VARCHAR(64) NOT NULL UNIQUE, ".
					"hash VARCHAR(64) NOT NULL, ".
					"name VARCHAR(64) NOT NULL, ".
					"surname VARCHAR(64) NOT NULL, ".
					"role ENUM ('user', 'admin') NOT NULL DEFAULT 'user', ".
					"PRIMARY KEY(id))");
		}
		
		function query($query) {
			$query = str_replace("@users", MYSQL_USERS_TABLE, $query);
			$this->result = $this->mysql->query($query);
			return $this->result;		
		}
		
		function toObject() {
			if($this->result->num_rows == 0) return null;
			return (object)$this->result->fetch_assoc();
		}
		
		function toArray() {
			return $this->result->fetch_array();
		}
		
		function get($key) {
			return $this->toObject()[$key];
		}
		
		function allRows() {
			$result = array();
			for($i = 0; $i < $this->result->num_rows; $i++) {
				$result[] = $this->toObject();
			}
			return $result;
		}
		
		function __destruct() {
			$this->mysql->close();
		}
	}
	
	function replaceConfig($comment, $value, $text) {
		return preg_replace("/\"$comment\", ?\".*\"/", "\"$comment\", \"$value\"", $text);
	}
	
	function editConfigFile($host=FIELD_NOT_CHANGED, $user=FIELD_NOT_CHANGED, $password=FIELD_NOT_CHANGED, $database=FIELD_NOT_CHANGED, $table=FIELD_NOT_CHANGED) {
		$file = file_get_contents("mysql_config.php");
		
		if($host != FIELD_NOT_CHANGED) {
			$file = replaceConfig("MYSQL_SERVER", $host, $file);
		}
		
		if($user != FIELD_NOT_CHANGED) {
			$file = replaceConfig("MYSQL_USER", $user, $file);
		}
		
		if($password != FIELD_NOT_CHANGED) {
			$file = replaceConfig("MYSQL_PASSWORD", $password, $file);
		}
		
		if($database != FIELD_NOT_CHANGED) {
			$file = replaceConfig("MYSQL_DATABASE", $database, $file);
		}
		
		if($table != FIELD_NOT_CHANGED) {
			$file = replaceConfig("MYSQL_USERS_TABLE", $table, $file);
		}
		
		file_put_contents("mysql_config.php", $file);
	}
?>