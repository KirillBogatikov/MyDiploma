<?php
	$response = array("code"=>RFC_FAIL, "body"=>"");

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
			case "list": break;
			case "add": break;
		}
	}
	
	echo json_encode($response);
?>