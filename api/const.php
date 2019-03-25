<?php
	$_CONST = [];
	
	function defConst($name, $val) {
		global $_CONST;
		$_CONST[$name] = $val;
		define($name, $val);
	}

	defConst("AUTH_COOKIE_ID", "id");
	defConst("AUTH_COOKIE_HASH", "hash");
	
	defConst("RFC_FAIL", 0x00);
	defConst("RFC_SUCCESS", 0x01);
	
	defConst("AUTH_NO_COOKIE", 0x10);
	defConst("AUTH_NO_USER", 0x11);
	
	defConst("USER_ID_GUEST", 0);
	
	defConst("USER_VALID", 0x20);
	defConst("USER_INVALID", 0x21);
	defConst("USER_INVALID_SHORT", 0x22);
	defConst("USER_INVALID_LONG", 0x23);
	defConst("USER_ROLE_GUEST", 0x24);
	defConst("USER_ROLE_USER", 0x25);
	defConst("USER_ROLE_ADMIN", 0x26);
	defConst("USER_LOGIN_BUSY", 0x27);
	defConst("USER_LOGIN_PATTERN", "/^[a-zA-Z0-9@_]+$/");
	defConst("USER_LOGIN_MIN", 4);
	defConst("USER_LOGIN_MAX", 16);
	defConst("USER_PASSWORD_PATTERN", "/^[a-zA-Z0-9_@#$%&+-]+$/");
	defConst("USER_PASSWORD_MIN", 8);
	defConst("USER_PASSWORD_MAX", 32);
	defConst("USER_NAME_PATTERN", "/^[a-zA-Zа-яА-Я]+$/u");
	defConst("USER_NAME_MIN", 1);
	defConst("USER_NAME_MAX", 32);
	defConst("USER_SURNAME_PATTERN", "/^[a-zA-Zа-яА-Я]+$/u");
	defConst("USER_SURNAME_MIN", 1);
	defConst("USER_SURNAME_MAX", 32);
?>