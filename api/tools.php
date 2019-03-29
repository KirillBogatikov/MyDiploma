<?php
	function uniqidReal($length = 13) {
		// uniqid gives 13 chars, but you could adjust it to your needs.
		if (function_exists("random_bytes")) {
			$bytes = random_bytes(ceil($length / 2));
		} elseif (function_exists("openssl_random_pseudo_bytes")) {
			$bytes = openssl_random_pseudo_bytes(ceil($length / 2));
		} else {
			throw new Exception("no cryptographically secure random function available");
		}
		return substr(bin2hex($bytes), 0, $length);
	}
	
	function listFiles($path) {
		include_once "files.php";
		$f = new File($path);
		$files = $f->listFiles(true); 
		
		$result = array();
		
		foreach($files as $file) {
			$result[] = array(
				"path" => $file->getPath(),
				"size" => $file->size(),
				"lastModified" => $file->lastModified(),
				"type" => $file->isFile() ? "file" : "dir"
			);
		}
		
		return $result;
	}
	
	echo json_encode(listFiles("../api/"));
?>