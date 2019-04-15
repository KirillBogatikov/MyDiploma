/**
 * 
 */

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

function __inBlank($el) {
	var $bl = $("#blank");
	var $eo = $el.offset();
	var $bo = $bl.offset();
	
	if($eo.left >= $bo.left && $eo.top >= $bo.top) {
		if($eo.left + $el.outerWidth() <= $bo.left + $bl.outerWidth()) {
			if($eo.top + $el.outerHeight() <= $bo.top + $bl.outerHeight()) {
				return true;
			}
		}
	}
	return false;
}

DraggableSegment = function(content, type, uid, w) {
	var $s, $d;
	
	if(~content.indexOf("resizable") || ~content.indexOf("static")) { 
		$s = this.$segment = $("<img class='segment'/>");
		$d = this.$dragged = $("<img class='segment'/>");
		var xhr = callRemoteFunction("segments", "load", { type: type, uid: uid, width: w*3 }, function() {
			var blob = URL.createObjectURL(xhr.response);
			$s.attr("src", blob);
			$d.attr("src", blob);
		}, "blob");
	} else {
		$s = $("<span class='segment'>Test</span>");
		$s.css("font-family", uid.font);
		
		$d = $("<span class='segment'>Test</span>");
		$d.css("font-family", uid.font);
		
		$("#fonts").text($("#fonts").text() + "@font-face{ font-family: \"" + uid.font + "\"; src: url(\"" + uid.file + "\"); } ");
	}
	
	var downPoint = null;
	$s.on("mousedown", function(event) {
		downPoint = { x: event.offsetX, y: event.offsetY };
		$d.width($s.width()).height($s.height());
		$(document.body).append($d);
		$d.offset({ left: event.pageX - downPoint.x, top: event.pageY - downPoint.y });
	});
	$(window).on("mousemove", function(event) {
		if(downPoint != null) {
			$d.offset({ left: event.pageX - downPoint.x, top: event.pageY - downPoint.y });
		}
	});
	
	var thiz = this;
	$(window).on("mouseup", function(event) {
		var offset = $d.offset();
		
		if(downPoint != null && __inBlank($d)) {
			$d.remove();
			thiz.onDropDown(offset.left, offset.top, $d.width(), $d.height());
		} else {
			$d.remove();
		}
		
		downPoint = null;
	});
	
	this.$segment = $s;
	this.$dragged = $d;
}

DraggableSegment.prototype.appendTo = function(div, width) {
	this.$segment.outerWidth(width);
	div.append(this.$segment);
};

DraggableSegment.prototype.onDropDown = function(x, y, width, height) {

}

ResizableSegment = function(dragged, type) {
	var $g = this.$dragged = $("<div class='resizable-tools-container'></div>");
	var $v = this.$view = dragged;
	var $s = this.$resize = $("<img class='resizable-tool' src='/img/tools/resize.png'/>");
	var id;
	
	var resizeDown = false;
	$s.on("mousedown", function() {
		resizeDown = true;
	});
	$(window).on("mousemove", function(event) {
		if(resizeDown) {
			var offset = $v.offset();
			var w = event.pageX - offset.left;
			var h = event.pageY - offset.top;
			$v.width(w < 0 ? -w : w).height(h < 0 ? -h : h);
		}
	});
	$(window).on("mouseup", function() {
		resizeDown = false;
	});
	
	var $d = this.delete = $("<img class='resizable-tool' src='/img/tools/delete.png'/>");
	$d.on("click", function() {
		Config.remove(id);
	});
	
	$g.append($v);
	$g.append($s);
	$g.append($d);
	
	var downPoint = null;
	$v.on("mousedown", function(event) {
		downPoint = { x: event.offsetX, y: event.offsetY };
		$(document.body).append($g);
		$g.offset({ left: event.pageX - downPoint.x, top: event.pageY - downPoint.y });
	});
	$(window).on("mousemove", function(event) {
		if(downPoint != null) {
			$g.offset({ left: event.pageX - downPoint.x, top: event.pageY - downPoint.y });
		}
	});
	$(window).on("mouseup", function(event) {
		if(downPoint != null && __inBlank($g)) {
			var offset = $g.offset();
			
			id = Config.addResizable(type, uid, offset.left, offset.top, $v.width(), $v.height());
			console.log(id);
		}
		
		downPoint = null;
	});
};

ResizableSegment.prototype.appendTo = function(div, width) {
	div.append(this.$dragged);
};