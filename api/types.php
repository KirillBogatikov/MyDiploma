<?php
	include_once "const.php";

	function listTypes() {
		$types = file_get_contents(TYPES_LIST_PATH);
		$types = json_decode($types);
		return $types;
	}
	
	function searchType($id, $list=null) {
		$types = ($list == null ? listTypes() : $list);
		foreach($types as $key => $type) {
			if($type->id == $id) {
				return $key;
			}
		}
		return -1;
	}
	
	function addType($id, $name, $storage, $type) {
		$origin = listTypes();
		if(searchType($id, $origin) != -1) {
			return RFC_EXISTS;
		}
		
		$origin[] = array(
			"id"   => $id,
			"name" => $name,
			"storage" => $storage,
			"type" => $type
		);
		file_put_contents(TYPES_LIST_PATH, json_encode($origin));
		return RFC_SUCCESS;
	}
	
	function editType($id, $name=NOT_CHANGED, $storage=NOT_CHANGED, $type=NOT_CHANGED) {
		$origin = listTypes();
		$key = searchType($id, $origin);
		if($key == -1) {
			return RFC_NOT_FOUND;
		}
	
		if($name != NOT_CHANGED) {
			$origin[$key]->name = $name;
		}
		if($storage != NOT_CHANGED) {
			$origin[$key]->$storage = $storage;
		}
		if($type != NOT_CHANGED) {
			$origin[$key]->$type = $type;
		}
		file_put_contents(TYPES_LIST_PATH, json_encode($origin));
		return RFC_SUCCESS;
	}
	
	function removeType($id) {
		$origin = listTypes();
		$key = searchType($id, $list);
		if($key == -1) {
			return RFC_NOT_FOUND;
		}
		unset($origin[$key]);
		
		file_put_contents(TYPES_LIST_PATH, json_encode($origin));
		return RFC_SUCCESS;
	}
?>