<?php
	function draw($uid, $w, $h) {
		include_once 'const.php';
		include_once 'config.php';
		include_once 'image.php';
		include_once 'types.php';
		include_once 'segments.php';
	
		if(gettype($uid) == "array") {
			$cfg = $uid;
			$uid = $uid["uid"];
		} else {
			$cfg = get_object_vars(loadCfg($uid));
		}
		$types = listTypes();
		
		$bgcolor = $cfg["bgcolor"];
		$image = new Image($w, $h, $bgcolor[0], $bgcolor[1], $bgcolor[2]);
		$texts = new Image($w, $h, $bgcolor[0], $bgcolor[1], $bgcolor[2]);
		
		foreach ($types as $type) {
			if(isset($cfg[$type->id])) {
				$parts = $cfg[$type->id];
				
				if(strpos($type->type, "editable") !== FALSE) {
					foreach ($parts as $part) {
						drawText($texts, $type->id, $part->uid, $part->x * $w, $part->y * $h, $part->size * $w, $part->color, $part->value);
					}
				}
			}
		}
		
		$texts->drawOn($image->image, 0, 0);
		
		foreach ($types as $type) {
			if(isset($cfg[$type->id])) {
				$parts = $cfg[$type->id];
				
				if($type->type == "static") {
					drawStatic($image, $type->id, $parts, $w, $h); 
				} else if(strpos($type->type, "editable") === FALSE) {
					foreach ($parts as $part) {
						drawResizable($image, $type->id, $part->uid, $part->x * $w, $part->y * $h, $part->width * $w, $part->height * $h);
					}
				}
			}
		}
		
		$image->save("test.png");
		$image->out();
	}
	
	function drawStatic($image, $type, $uid, $width, $height) {
		$src = new Image(findPathToSegment($type, $uid));
		$src->resize($width, $height);
		$src->drawOn($image->image, 0, 0);
	}
	
	function drawText($image, $type, $uid, $x, $y, $size, $color, $value) {
		$size = ((int)$size)/1;
		$font = "..".($uid->file);
		$cl = imagecolorallocate($image->image, $color[0], $color[1], $color[2]);
		
		$lines = explode("\n", $value);
		$bounds = imageftbbox($size, 0.0, $font, $lines[0]);
		
		$x += abs($bounds[0]);
		$y += abs($bounds[5]) + abs($bounds[7]);
		
		$w = abs($bounds[2] - $bounds[0]);
		$h = abs($bounds[7] - $bounds[1]);
		
		foreach($lines as $text) {
			$b = imagettfbbox($size, 0.0, $font, $text);
			
			$lw = abs($b[2] - $b[0]);
			
			imagettftext($image->image, $size, 0.0, $x + ($w - $lw) / 2, $y, $cl, $font, $text);
			$y += $h*1.25;
		}
	}
	
	function drawResizable($image, $type, $uid, $x, $y, $width, $height) {
		$part = new Image(findPathToSegment($type, $uid));
		$part->resize($width, $height);
		$part->drawOn($image->image, $x, $y);
		$part->destroy();
	}
?>