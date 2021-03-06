<?php
	include_once "const.php";
	include_once "mysql.php";
	include_once "auth.php";
	
	function isUserExists($login) {
		$mysql = new MySQLConnection();
		$mysql->query("SELECT id FROM @users WHERE login='$login'");
		
		return $mysql->result->num_rows === 1;
	}
	
	function readUser($id) {
		if(!checkAccess() && $id != currentID()) {
			return ACCESS_DENIED;
		}
		
		$mysql = new MySQLConnection();
		$mysql->query("SELECT id, login, name, surname, role FROM @users WHERE id='$id'");
		
		if($mysql->result->num_rows == 1) {
			$user = $mysql->toObject();
			return $user;
		}
		
		return RFC_NOT_FOUND;
	}
	
	function saveUser($login=FIELD_NOT_CHANGED, $old_password=FIELD_NOT_CHANGED, $password=FIELD_NOT_CHANGED, $name=FIELD_NOT_CHANGED, $surname=FIELD_NOT_CHANGED) {
		if(currentRole() == USER_ROLE_GUEST) {
			return ACCESS_DENIED;
		}
		
		$mysql = new MySQLConnection();
		$mysql->query("SELECT login, hash, name, surname, role FROM @users WHERE id=".currentID());
		$user = $mysql->toObject();
		
		$response = array();
		
		if($login != FIELD_NOT_CHANGED) {
			$loginV = validate($login, USER_LOGIN_PATTERN, USER_LOGIN_MIN, USER_LOGIN_MAX);
			$response["login"] = $loginV;
			
			if($loginV == USER_VALID) {
				$user->login = $login;
			}
		} else {
			$login = $user->login;
		}
		
		if($old_password != FIELD_NOT_CHANGED) {
			$passwordV = validate($password, USER_PASSWORD_PATTERN, USER_PASSWORD_MIN, USER_PASSWORD_MAX);
			$response["password"] = $passwordV;
			
			if($passwordV == USER_VALID) {
				if($user->hash != md5(md5($old_password))) {
					$response["password"] = ACCESS_DENIED;
				}
				$user->hash = md5(md5($password));
			}
		}
		$hash = $user->hash;
		
		if($name != FIELD_NOT_CHANGED) {
			$nameV = validate($name, USER_NAME_PATTERN, USER_NAME_MIN, USER_NAME_MAX);
			$response["name"] = $nameV;
			
			if($nameV == USER_VALID) {
				$user->name = $name;
			}
		} else {
			$name = $user->name;
		}
		
		if($surname != FIELD_NOT_CHANGED) {
			$surnameV = validate($surname, USER_SURNAME_PATTERN, USER_SURNAME_MIN, USER_SURNAME_MAX);
			$response["surname"] = $surnameV;
			
			if($surnameV == USER_VALID) {
				$user->surname = $surname;
			}
		} else {
			$surname = $user->surname;
		}
		
		if(in_array(USER_VALID, $response)) {
			$mysql->query("UPDATE @users SET login='$login', hash='$hash', name='$name', surname='$surname' WHERE id=".currentID());
		}
		
		return $response;
	}
	
	function deleteUser($id) {
		if(!checkAccess() && $id != currentID()) {
			return ACCESS_DENIED;
		}
		
		$mysql = new MySQLConnection();
		$mysql->query("DELETE FROM @users WHERE id=$id");
		if($mysql->result) {
			signout();
			return RFC_SUCCESS;
		}
		return RFC_FAIL;
	}
	
	function listUploads($id) {
		if(!checkAccess() && $id != currentID()) {
			return ACCESS_DENIED;
		}
		
		$dir = new File("../users/$id/uploads/");
		return $dir->listNames(".png", false);
	}
	
	function listConfigs($id) {
		if(!checkAccess() && $id != currentID()) {
			return ACCESS_DENIED;
		}
		
		$dir = new File("../users/$id/configs/");
		return $dir->listNames(".json", false);
	}
	
	function listUsers($request) {
		if(!checkAccess()) {
			return ACCESS_DENIED;
		}
		
		$query = "SELECT ";
		
		if(isset($request["fields"])) {
			$query .= $request["fields"];
		} else {
			$query .= "*";
		}
		
		$query .= " FROM @users";
		
		if(isset($request["sort"])) {
			$sort = $request["sort"];
			$query .= " ORDER BY ".$sort["field"];
			if($sort["to"] == "down") {
				$query .= " ASC";
			} else {
				$query .= " DESC";
			}
		}
		
		if(isset($request["limit"])) {
			$limit = $request["limit"];
			$query .= " LIMIT ".($limit["offset"]).", ".$limit["length"];
		}
		
		$mysql = new MySQLConnection();
		$mysql->query($query);
		return $mysql->allRows();
	}
?>