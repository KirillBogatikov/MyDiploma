ListItem = function(type, uid, width) {
	var $i = this.$item = $("<img class='segment'/>");
	var $d = this.$draggable = $("<img class='dragged-segment'/>");
	
	$i.outerWidth(width);
	$d.outerWidth(width);
	
	var xhr = callRemoteFunction("segments", "load", { type: type.id, uid: uid, width: width }, function(data) {
		var blob = URL.createObjectURL(xhr.response);
		
		$i.attr("src", blob);
		$d.attr("src", blob);
	}, "blob");
	
	var update_draggable = function(x, y) {
		$d.css("top", y).css("left", x);
	};
	
	var out_blank = function(d_off) {
		var $b = $("#blank");
		var b_off = $b.offset();
		
		if(d_off.left < b_off.left || d_off.top < b_off.top) {
			return true;
		}
		
		if(d_off.left + $d.width() > b_off.left + $b.width() ||
		   d_off.top + $d.height() > b_off.top + $b.height()) {
			return true;
		}
		
		return false;
	};
	
	var down = null;
	$i.on("mousedown", function(event) {
		down = { x: event.offsetX, y: event.offsetY };
		
		update_draggable(event.pageX - down.x, event.pageY - down.y);
		$(document.body).append($d);
	})
	
	$(window).on("mousemove", function(event) {
		if(down != null)  {
			update_draggable(event.pageX - down.x, event.pageY - down.y);
		}
	})
	
	$(window).on("mouseup", function(event) {
		var offset = $d.offset();
		var width = $d.width(), height = $d.height();
		$d.fadeOut(200, function() {
			$d.offset({ top: 0, left: 0 });
			$d.remove();
			$d.fadeIn();
		});
		
		if(down) {
			if(out_blank(offset)) return;
			
			offset.left -= $("#blank").offset().left;
			offset.top -= $("#blank").offset().top;
			
			if(~type.type.indexOf("static")) {
				Config.setStatic(type.id, uid);
			} else {
				if(~type.type.indexOf("resizable")) {
					Config.addResizable(type, uid, offset.left, offset.top, width, height, $d.attr("src"));
				} else if(~type.type.indexOf("editable")) {
					Config.addEditable(type, uid, offset.left, offset.top, type.file, 24, [0, 0, 0]);
				}
			}
		}
		
		down = null;
	});
};

ListItem.prototype.appendTo = function(root) {
	root.append(this.$item);
};

Resizable = function(type, uid, x, y, width, height, anchor, defSrc) {
	x += $("#blank").offset().left;
	y += $("#blank").offset().top;
	
	var $r = this.$root = $("<div class='resizable-tools-container'></div>");
	var $i = this.$image = $("<img src='" + defSrc + "'/>");
	var $s = this.$resize = $("<img class='resizable-tool' src='/img/tools/resize.png' />");
	var $d = this.$delete = $("<img class='resizable-tool' src='/img/tools/delete.png' />");
	
	$r.offset({ top: y, left: x });
	$d.width($("#blank").width() / 10);
	$s.width($("#blank").width() / 10);
	
	var xhr = callRemoteFunction("segments", "load", { type: type, uid: uid }, function() {
		var blob = URL.createObjectURL(xhr.response);
		$i.attr("src", blob);
	}, "blob");
	
	var update_draggable = function(x, y) {
		$r.offset({ top: y, left: x });
	};
	
	var update_tools = function(width, height) {
		$i.width(width).height(height);
		$d.css("margin-left", width - ($d.width() / 2)).css("margin-top", -($d.width() / 2));
		$s.css("margin-left", width - ($d.width() / 2)).css("margin-top", height - ($d.width() / 2));
	};
	
	update_tools(width, height);
	
	var out_blank = function(d_off) {
		var $b = $("#blank");
		var b_off = $b.offset();
		
		if(d_off.left < b_off.left || d_off.top < b_off.top) {
			return true;
		}
		
		if(d_off.left + $d.width() > b_off.left + $b.width() ||
		   d_off.top + $d.height() > b_off.top + $b.height()) {
			return true;
		}
		
		return false;
	};
	
	var moveDown = null;
	$i.on("mousedown", function(event) {
		moveDown = { x: event.offsetX, y: event.offsetY };
	})
	
	var resizeDown = false;
	$s.on("mousedown", function(event) {
		resizeDown = true;
	});
	
	$(window).on("mousemove", function(event) {
		if(moveDown != null)  {
			update_draggable(event.pageX - moveDown.x, event.pageY - moveDown.y);
		}
		if(resizeDown) {
			var width = Math.abs(event.pageX - $r.offset().left);
			var height = Math.abs(event.pageY - $r.offset().top);
			
			update_tools(width, height);
		}
	})
	
	$(window).on("mouseup", function(event) {
		if(moveDown) {
			if(out_blank($r.offset())) { $d.click(); return; };
			
			var offset = $r.offset();
			Config.changeResizable(anchor, offset.left - $("#blank").offset().left, offset.top - $("#blank").offset().top, $i.width(), $i.height());
		}
		
		moveDown = null;
		resizeDown = false;
	});
	
	$d.on("click", function(event) {
		Config.remove(anchor);
		$r.fadeOut(300, function() {
			$r.remove();
		});
	});
	
	$r.on("mouseenter", function() {
		$d.fadeIn(200);
		$s.fadeIn(200);
	});
	$r.on("mouseleave", function() {
		$d.fadeOut(200);
		$s.fadeOut(200);
	});
	$r.append($i).append($s).append($d);
	
	$(document.body).append($r);
};

Editable = function() {
	
};