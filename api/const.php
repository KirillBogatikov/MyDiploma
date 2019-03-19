<?php
	define("AUTH_COOKIE_ID", "id");
	define("AUTH_COOKIE_HASH", "hash");
	
	define("RFC_FAIL", 0x00);
	define("RFC_SUCCESS", 0x01);
	
	define("AUTH_NO_COOKIE", 0x10);
	define("AUTH_NO_USER", 0x11);
	
	define("USER_ID_GUEST", 0);
	
	define("USER_VALID", 0x20);
	define("USER_INVALID", 0x21);
	define("USER_INVALID_SHORT", 0x22);
	define("USER_INVALID_LONG", 0x23);
	define("USER_ROLE_GUEST", 0x24);
	define("USER_ROLE_USER", 0x25);
	define("USER_ROLE_ADMIN", 0x26);
	define("USER_LOGIN_BUSY", 0x27);
	define("USER_LOGIN_PATTERN", "/^[a-zA-Z0-9@_]+$/");
	define("USER_LOGIN_MIN", 4);
	define("USER_LOGIN_MAX", 16);
	define("USER_PASSWORD_PATTERN", "/^[a-zA-Z0-9_@#$%&+-]+$/");
	define("USER_PASSWORD_MIN", 8);
	define("USER_PASSWORD_MAX", 32);
	define("USER_NAME_PATTERN", "/^[a-zA-Zа-яА-Я]+$/u");
	define("USER_NAME_MIN", 1);
	define("USER_NAME_MAX", 32);
	define("USER_SURNAME_PATTERN", "/^[a-zA-Zа-яА-Я]+$/u");
	define("USER_SURNAME_MIN", 1);
	define("USER_SURNAME_MAX", 32);
	
?>