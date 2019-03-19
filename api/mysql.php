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
			return (object)$this->result->fetch_assoc();
		}
		
		function toArray() {
			return $this->result->fetch_array();
		}
		
		function get($key) {
			return $this->toObject()[$key];
		}
		
		function __destruct() {
			$this->mysql->close();
		}
	}
?>