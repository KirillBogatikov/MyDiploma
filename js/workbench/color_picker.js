ColorPicker = function(parent) {
	var $r = this.$root = parent;
	var width = $r.width();
	var height = $r.width();
	
	var $c = this.$circle = $("<canvas></canvas>");
	$r.append($c);
	
	var circleOffset = $c.offset();
	
	$c.attr("width", width).attr("height", height);
	var ctx = $c[0].getContext('2d');
	
	var $img = new Image();
	$img.onload = function() {
		ctx.drawImage($img, 0, 0, $img.width, $img.height, 0, 0, width, height);
	};
	$img.src = "/img/color_ring.png";
	
	$s = this.$selector = $("<div></div>");
	$s.css("background", "white")
	  .css("border", "solid 1px black")
	  .css("position", "absolute")
	  .width(3)
	  .height(3)
	  .css("top", height / 2)
	  .css("left", width / 2);
	
	$r.append($s);
	
	var MOUSE_DOWN = false;
	var thiz = this;

	var on_pick_color = function(x, y) {
		var color = ctx.getImageData(x, y, 1, 1).data;
		
		if(color[3] == 255) {
			$s.offset({ top: circleOffset.top + y - 2, left: circleOffset.left + x - 2});
			thiz.onColorPicked(color);
			return true;
		}
		return false;
	}
	
	$c.on("mousedown", function(event) {
		if(on_pick_color(event.offsetX, event.offsetY)) {
			MOUSE_DOWN = true;
		}
	});
	
	$(document).on("mousemove", function(event){
		if(MOUSE_DOWN) {
			on_pick_color(event.offsetX, event.offsetY);
		}
	});
	
	$(document).on("mouseup", function(event) {
		MOUSE_DOWN = false;
	});
}

ColorPicker.prototype.onColorPicked = function(color) {
	
};