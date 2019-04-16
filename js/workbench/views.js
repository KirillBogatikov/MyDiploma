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
		$d.offset({ top: y, left: x });
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
		$d.remove();
		
		if(down) {
			if(out_blank(offset)) return;
			
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
	var $r = this.$root = $("<div class='resizable-tools-container'></div>");
	var $i = this.$image = $("<img src='" + defSrc + "'/>");
	var $s = this.$resize = $("<img class='resizable-tool' src='/img/tools/resize.png' />");
	var $d = this.$delete = $("<img class='resizable-tool' src='/img/tools/delete.png' />");
	
	$r.offset({ top: y, left: x });
	$i.width(width).height(height);
	$d.width(width / 4).css("margin-left", width * 0.875).css("margin-top", -width * 0.125);
	$s.width(width / 4).css("margin-left", width * 0.875).css("margin-top", width * 0.875);
	
	var xhr = callRemoteFunction("segments", "load", { type: type, uid: uid }, function() {
		var blob = URL.createObjectURL(xhr.response);
		$i.attr("src", blob);
	}, "blob");
	
	var update_draggable = function(x, y) {
		$r.offset({ top: y, left: x });
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
	})
	
	$(window).on("mousemove", function(event) {
		if(down != null)  {
			update_draggable(event.pageX - down.x, event.pageY - down.y);
		}
	})
	
	$(window).on("mouseup", function(event) {
		if(down) {
			if(out_blank($r.offset())) { $d.click(); return; };
			
			var offset = $r.offset();
			Config.changeResizable(anchor, offset.left, offset.top, $i.width(), $i.height());
		}
		
		down = null;
	});
	
	$d.on("click", function(event) {
		Config.remove(anchor);
		$r.fadeOut(300, function() {
			$r.remove();
		});
	});
	
	$s.on("mousedown", function(event) {
		console.log("E");
	});
	
	$r.append($i).append($s).append($d);
	
	$(document.body).append($r);
};

Editable = function() {
	
};