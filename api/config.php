<?php
	include_once "const.php";
	include_once "auth.php";
	include_once "files.php";
	include_once "tools.php";
	
	function recoverCfg($broken) {
		$pattern = json_decode(file_get_contents(CONFIG_PATTERN_PATH));
		
		foreach($broken as $key => $value) {
			$pattern->$key = $value;
		}
		
		return $pattern;
	}
	
	function resolvePath($uid=null) {
		$path = "../users/".currentID()."/";
		if($uid != null) {
			$path .= "$uid.json";
		}
		return $path;
	}
	
	function createCfg() {
		$uid = uniqidReal();
		$data = recoverCfg(array("uid" => $uid));
		saveCfg($uid, $data);
		return $data;
	}
	
	function loadCfg($uid) {
		if(!checkAccess(USER_ROLE_USER)) {
			return ACCESS_DENIED;
		}
		
		$path = resolvePath($uid);
		if(!file_exists($path)) {
			return RFC_NOT_FOUND;	
		}
		
		$file = file_get_contents($path);
		$file = json_decode($file);
		return recoverCfg($file);
	}
	
	function saveCfg($uid, $cfg) {
		if(!checkAccess(USER_ROLE_USER)) {
			return ACCESS_DENIED;
		}
		
		file_put_contents(resolvePath($uid), json_encode($cfg));
	}
	
	function removeCfg($uid) {
		if(!checkAccess(USER_ROLE_USER)) {
			return ACCESS_DENIED;
		}
		
		$file = new File(resolvePath($uid));
		if(!$file->exists()) {
			return RFC_NOT_FOUND;
		}
		$file->delete();
		
		return RFC_SUCCESS;
	}
	
	function listCfg() {
		if(!checkAccess(USER_ROLE_USER)) {
			return ACCESS_DENIED;
		}
		
		$dir = new File(resolvePath());
		return $dir->listNames("*.json", false);
	}
?>