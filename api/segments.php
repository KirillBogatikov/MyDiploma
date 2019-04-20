<?php
	include_once "const.php";
	include_once "image.php";
	include_once "types.php";
	include_once "files.php";
	include_once "auth.php";
	include_once "tools.php";
	
	function listSegments($type, $offset, $length) {
		$types = listTypes();
		$type = searchType($type, $types);
		if($type == -1) {
			return RFC_NOT_FOUND;
		}
		$type = $types[$type];
		
		$list;
		if($type->storage == "json") {
			$list = json_decode(file_get_contents(SEGMENTS_DIR."/".($type->id).".json"));
		} else {
			$list = new File(SEGMENTS_DIR.($type->id)."/");
			$list = $list->listNames("*.png", false);	
		}
		
		if(isset($offset)) {
			$list = array_slice($list, $offset, $length);
		}
		return $list;
	}
	
	function findPathToSegment($type, $uid) {
		return SEGMENTS_DIR."$type/$uid.png";
	}
	
	function loadSegment($type, $uid, $width, $height) {
		$image = new Image(findPathToSegment($type, $uid));
		if(isset($width) && isset($height)) {
			$image->resize($width, $height);
		} else if(isset($width)) {
			$image->resizeToWidth($width);
		} else if(isset($height)) {
			$image->resizeToHeight($height);
		}
		$image->out();
	}
	
	function uploadSegment($type, $file, $uid=-1) {
		if(!checkAccess()) {
			return ACCESS_DENIED;
		}
		
		if($uid == -1) {
			$uid = uniqidReal();
		}
		
		$moved = move_uploaded_file($file, findPathToSegment($type, $uid));
		if($moved) {
			return RFC_SUCCESS;
		}
		return RFC_NOT_FOUND; 
	}
	
	function removeSegment($type, $uid) {
		if(!checkAccess()) {
			return ACCESS_DENIED;
		}
		
		$file = new File(findPathToSegment($type, $uid));
		if(!$file->exists()) {
			return RFC_NOT_FOUND;
		}
		$file->delete();
		return RFC_SUCCESS;
	}
?>