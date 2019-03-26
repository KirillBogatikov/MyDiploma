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
	} else if(isset($_GET["segments"])) {
		include_once "segments.php";
		
		switch($_POST["method"]) {
			case "list":
				$response["body"] = listSegments($_POST["id"], $_POST["offset"], $_POST["length"]);
			break;
			case "load":
				loadSegment($_POST["type"], $_POST["uid"], $_POST["width"], $_POST["height"]);
			break;
			case "upload":
				$response["code"] = uploadSegment($_POST["type"], $_FILES["image"], isset($_POST["uid"]) ? $_POST["uid"] : -1);
			break;
			case "remove":
				$response["code"] = removeSegment($_POST["type"], $_POST["uid"]);
			break;
		}
	} else if(isset($_GET["config"])) {
		include_once "config.php";
		
		switch($_POST["method"]) {
			case "create": $response["code"] = createCfg(); break;	
			case "load": $response["body"] = loadCfg($_POST["uid"]); break;
			case "save": $response["body"] = saveCfg($_POST["uid"], $_POST["config"]); break;
			case "remove": $response["code"] = removeCfg($_POST["uid"]); break;
			case "list": $response["body"]  = listCfg(); break;
		}
	}
	
	echo json_encode($response);
?>