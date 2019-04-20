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
			default:
				$response["code"] = NO_SUCH_METHOD;
		}
	} else if(isset($_GET["types"])) {
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
					isset($_POST["name"]) ? $_POST["name"] : FIELD_NOT_CHANGED,
					isset($_POST["storage"]) ? $_POST["storage"] : FIELD_NOT_CHANGED,
					isset($_POST["type"]) ? $_POST["type"] : FIELD_NOT_CHANGED);
			break;
			case "remove": 
				$response["code"] = removeType($_POST["id"]); 
			break;
			default:
				$response["code"] = NO_SUCH_METHOD;
		}
	} else if(isset($_GET["tools"])) {
		include_once "tools.php";
		
		switch($_POST["method"]) {
			case "const": $response["body"] = $_CONST; break;
			case "uniqid": $response["body"] = uniqidReal(); break;
			default: $response["code"] = NO_SUCH_METHOD;
		}
	} else if(isset($_GET["segments"])) {
		include_once "segments.php";
		
		switch($_POST["method"]) {
			case "list":
				$response["body"] = listSegments($_POST["type"], $_POST["offset"], $_POST["count"]);
			break;
			case "load":
				loadSegment($_POST["type"], $_POST["uid"], $_POST["width"], $_POST["height"]);
				exit;
			break; 
			case "upload":
				$response["code"] = uploadSegment($_POST["type"], $_FILES["image"], isset($_POST["uid"]) ? $_POST["uid"] : -1);
			break;
			case "remove":
				$response["code"] = removeSegment($_POST["type"], $_POST["uid"]);
			break;
			default:
				$response["code"] = NO_SUCH_METHOD;
		}
	} else if(isset($_GET["config"])) {
		include_once "config.php";
		
		switch($_POST["method"]) {
			case "create": $response["body"] = createCfg(); break;	
			case "load": $response["body"] = loadCfg($_POST["uid"]); break;
			case "save": $response["body"] = saveCfg($_POST["uid"], $_POST["config"]); break;
			case "draw": 
				include_once "draw.php";
				draw($_POST["uid"], $_POST["width"], $_POST["height"]);
				exit;
			break;
			case "remove": $response["code"] = removeCfg($_POST["uid"]); break;
			case "list": $response["body"]  = listCfg(); break;
			default: $response["code"] = NO_SUCH_METHOD;
		}
	} else if(isset($_GET["user"])) {
		include_once "user.php";
		
		switch($_POST["method"]) {
			case "exists": $response["code"] = isUserExists($_POST["login"]); break;
			case "read": $response["body"] = readUser(isset($_POST["id"]) ? $_POST["id"] : currentID()); break;
			case "save": $response["body"] = saveUser(
				isset($_POST["login"]) ? $_POST["login"] : FIELD_NOT_CHANGED,
				isset($_POST["old_password"]) ? $_POST["old_password"] : FIELD_NOT_CHANGED,
				isset($_POST["new_password"]) ? $_POST["new_password"] : FIELD_NOT_CHANGED,
				isset($_POST["name"]) ? $_POST["name"] : FIELD_NOT_CHANGED,
				isset($_POST["surname"]) ? $_POST["surname"] : FIELD_NOT_CHANGED
			); break;
			case "delete": $response["body"] = deleteUser(isset($_POST["id"]) ? $_POST["id"] : currentID()); break;
			case "configs": $response["body"] = listConfigs(isset($_POST["id"]) ? $_POST["id"] : currentID()); break;
			case "uploads": $response["body"] = listUploads(isset($_POST["id"]) ? $_POST["id"] : currentID()); break;
			case "list": $response["body"] = listUsers($_POST["params"]); break;
			default: $response["code"] = NO_SUCH_METHOD;
		} 
	} else {
		$response["code"] = NO_SUCH_GROUP;
	}
	
	echo json_encode($response);
?>