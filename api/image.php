<?php
    class Image {
        var $image;
        var $type;

        function __construct() {
            $args = func_get_args();
            $argc = func_num_args();
            if($argc == 1) {
                $image_info = getimagesize($args[0]);
                $this->type = $image_info[2];
            
                switch($this->type) {
                    case IMAGETYPE_JPEG: $this->image = imagecreatefromjpeg($args[0]); break;
                    case IMAGETYPE_GIF: $this->image = imagecreatefromgif($args[0]); break;
                    case IMAGETYPE_PNG: $this->image = imagecreatefrompng($args[0]); break;
                }                
            } else {
                $this->type = IMAGETYPE_PNG;

                $this->image = imagecreatetruecolor($args[0], $args[1]);
                $color = imagecolorallocate($this->image, $args[2], $args[3], $args[4]);
                imagefilledrectangle($this->image, 0, 0, $args[0], $args[1], $color);
            }

            imageAlphaBlending($this->image, false);
            imageSaveAlpha($this->image, true);
        }

        function save($filename, $compression=75) {
            switch($this->type) {
                case IMAGETYPE_JPEG: imagejpeg($this->image, $filename, $compression); break;
                case IMAGETYPE_GIF: imagegif($this->image, $filename); break;
                case IMAGETYPE_PNG: imagepng($this->image, $filename); break;
            }
        }

        function out() {
            header("Content-Type: ".($this->mimeType()));
            switch($this->type) {
                case IMAGETYPE_JPEG: imagejpeg($this->image); break;
                case IMAGETYPE_GIF: imagegif($this->image); break;
                case IMAGETYPE_PNG: imagepng($this->image); break;
            }
        }

        function mimeType() {
            $type = "";
            switch($this->type) {
                case IMAGETYPE_JPEG: $type = "jpeg"; break;
                case IMAGETYPE_GIF: $type = "gif"; break;
                case IMAGETYPE_PNG: $type = "png"; break;
            }           
            return "image/$type";
        }

        function getWidth() {
            return imagesx($this->image);
        }
        
        function getHeight() {
            return imagesy($this->image);
        }
        
        function resizeToHeight($height, $high_quality=true) {
            $ratio = $height / $this->getHeight();
            $width = $this->getWidth() * $ratio;
            $this->resize($width, $height, $high_quality);
        }

        function resizeToWidth($width, $high_quality=true) {
            $ratio = $width / $this->getWidth();
            $height = $this->getheight() * $ratio;
            $this->resize($width, $height, $high_quality);
        }

        function scale($scale, $high_quality=true) {
            $width = $this->getWidth() * $scale/100;
            $height = $this->getheight() * $scale/100;
            $this->resize($width, $height, $high_quality);
        }
        
        function resize($width=-1, $height=-1, $high_quality=true) {
            if($width == -1) {
                return $this->resizeToHeight($height, $high_quality);
            }
            if($height == -1) {
                return $this->resizeToWidth($width, $high_quality);
            }

            $new_image;
            if($high_quality) {
                $new_image = imagecreatetruecolor($width, $height);
            } else {
                $new_image = imagecreate($width, $height);
            }

            imageAlphaBlending($new_image, false);
            imageSaveAlpha($new_image, true);
        
            imagecopyresampled($new_image, $this->image, 0, 0, 0, 0, $width, $height, $this->getWidth(), $this->getHeight());
            $this->image = $new_image;
        }

        function drawOn($dst, $dst_x, $dst_y, $src_x=0, $src_y=0, $src_w=-1, $src_h=-1, $pct=100) {
            if($src_w < 0) { $src_w = $this->getWidth(); }
            if($src_h < 0) { $src_h = $this->getHeight(); }

            mergeImages($dst, $this->image, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct);
        }

        function destroy() {
            imagedestroy($this->image);
        }
    }

    function mergeImages($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct){
        $cut = imagecreatetruecolor($src_w, $src_h);
        imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h);
        imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h);
        imagecopymerge($dst_im, $cut, $dst_x, $dst_y, 0, 0, $src_w, $src_h, $pct);
    }
?>