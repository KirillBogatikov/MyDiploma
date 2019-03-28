<?php
	include_once "const.php";
	include_once "mysql.php";

	function setAuthCookie($id, $hash) {
		setcookie(AUTH_COOKIE_ID, $id, time() + 60 * 60 * 24 * 30, "/");
		setcookie(AUTH_COOKIE_HASH, $hash, time() + 60 * 60 * 24 * 30, "/");
	}

	function signin($login=null, $password=null) {
		$user;
		$hash;
		
		if(isset($login) && isset($password)) {
			$mysql = new MySQLConnection();
			$mysql->query("SELECT id, hash FROM @users WHERE login='$login'");
			$user = $mysql->toObject();
			
			$hash = md5(md5($password));
		} else if(isset($_COOKIE[AUTH_COOKIE_ID]) && isset($_COOKIE[AUTH_COOKIE_HASH])) {
			$user = findUserById($_COOKIE[AUTH_COOKIE_ID]);
			$hash = $_COOKIE[AUTH_COOKIE_HASH];
		} else {
			return AUTH_NO_COOKIE;
		}
		
		if(!$user) {
			return AUTH_NO_USER;
		}
		
		if($user->hash == $hash) {
			setAuthCookie($user->id, $user->hash);
			return RFC_SUCCESS;
		}
		return RFC_FAIL;
	}
	
	function signup($login, $password, $name, $surname) {
		$loginV = validate($login, USER_LOGIN_PATTERN, USER_LOGIN_MIN, USER_LOGIN_MAX);
		$passwordV = validate($password, USER_PASSWORD_PATTERN, USER_PASSWORD_MIN, USER_PASSWORD_MAX);
		$nameV = validate($name, USER_NAME_PATTERN, USER_NAME_MIN, USER_NAME_MAX);
		$surnameV = validate($surname, USER_SURNAME_PATTERN, USER_SURNAME_MIN, USER_SURNAME_MAX);
		
		$response = array();
		
		if($loginV != USER_VALID) {
			$response["login"] = $loginV;
		}
		if($passwordV != USER_VALID) {
			$response["password"] = $passwordV;
		}
		if($nameV != USER_VALID) {
			$response["name"] = $nameV;
		}
		if($surnameV != USER_VALID) {
			$response["surname"] = $surnameV;
		}
		
		/* all valid */
		if(count($response) == 0) {
			$hash = md5(md5($password));
			$mysql = new MySQLConnection();
			$mysql->query("INSERT INTO @users (login, hash, name, surname) VALUES ('$login', '$hash', '$name', '$surname')");
			
			if($mysql->result) {
				$mysql->query("SELECT id FROM @users WHERE login='$login'");
				$user = $mysql->toObject();
				setAuthCookie($user->id, $hash);
				
				$dir = new File("../users/".($user->id)."/configs/");
				$dir->mkdir();
				$dir = new File("../users/".($user->id)."/uploads/");
				$dir->mkdir();
				
				return RFC_SUCCESS;
			} else {
				return USER_LOGIN_BUSY;	
			}
		} else {
			return $response;
		}
	}
	
	function currentRole() {
		if(isset($_COOKIE[AUTH_COOKIE_ID]) && isset($_COOKIE[AUTH_COOKIE_HASH])) {
			$mysql = new MySQLConnection();
			$mysql->query("SELECT role FROM @users WHERE id='".$_COOKIE[AUTH_COOKIE_ID]."'");
			$user = $mysql->toObject();
			
			return $user->role == "admin" ? USER_ROLE_ADMIN : USER_ROLE_USER;
		} 
		return USER_ROLE_GUEST;
	}
	
	function currentID() {
		if(currentRole() != USER_ROLE_GUEST) {
			return $_COOKIE[AUTH_COOKIE_ID];
		}
		return USER_ID_GUEST;
	}
	
	function signout() {
		unset($_COOKIE[AUTH_COOKIE_ID]);
		unset($_COOKIE[AUTH_COOKIE_HASH]);
		setcookie(AUTH_COOKIE_ID, "", time() - 3600, "/");
		setcookie(AUTH_COOKIE_HASH, "", time() - 3600, "/");
	}
	
	function checkAccess($level=USER_ROLE_ADMIN) {
		return currentRole() >= $level;
	}
	
	function validate($string, $pattern, $min, $max) {
		$len = strlen($string);
		if($len < $min) {
			return USER_INVALID_SHORT;
		} else if($len > $max) {
			return USER_INVALID_LONG;
		}
		
		$valid = (boolean)preg_match($pattern, $string);
		return $valid ? USER_VALID : USER_INVALID;
	}
?>