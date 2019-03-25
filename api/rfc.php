<?php
	include_once "const.php";
	
	$response = array("code"=>RFC_SUCCESS, "body"=>"");

	if(isset($_GET["auth"])) {
		include_once "auth.php";
		
		switch($_POST["method"]) {
			case "signin": 
				$response["code"] = signin($_POST["login"], $_POST["password"]);
			break;
			case "signup":
				$r = signup($_POST["login"], $_POST["password"], $_POST["name"], $_POST["surname"]);
				if(gettype($r) == "array") {
					$response["body"] = $r; 
				} else {
					$response["code"] = $r;
				}
			break;
			case "signout": 
				$response["code"] = signout();	
			break;
			case "role": 
				$response["body"] = currentRole(); 	
			break;
			case "id": 
				$response["body"] = currentID();	
			break;
		}
	} else if(isset($_GET["type"])) {
		include_once "types.php";
		
		switch($_POST["method"]) {
			case "list": 
				$response["body"] = listTypes(); 
			break;
			case "add": 
				$response["code"] = addType($_POST["id"], $_POST["name"], $_POST["storage"], $_POST["type"]); 
			break;
			case "edit": 
				$response["code"] = editType($_POST["id"], 
					isset($_POST["name"]) ? $_POST["name"] : NOT_CHANGED,
					isset($_POST["storage"]) ? $_POST["storage"] : NOT_CHANGED,
					isset($_POST["type"]) ? $_POST["type"] : NOT_CHANGED);
			break;
			case "remove": 
				$response["code"] = removeType($_POST["id"]); 
			break;
		}
	} else if(isset($_GET["const"])) {
		$response["body"] = $_CONST;
	} else if(isset($_GET[""])) {
		
	}
	
	echo json_encode($response);
?>