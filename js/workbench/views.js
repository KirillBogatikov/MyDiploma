ListItem = function(type, uid, width) {
	var $i = this.$item = $("<img class='segment'/>");
	var $d = this.$draggable = $("<img />");
	
	var xhr = callRemoteFunction("segments", "load", { type: type.id, uid: uid }, function(data) {
		var blob = URL.createObjectURL(xhr.response);
		
		$i.attr("src", blob);
		$d.attr("src", blob);
	}, "blob");
	
	var update_draggable = function(x, y) {
		$d.offset({ top: y, left: x });
	};
	
	var out_blank = function() {
		var d_off = $d.offset();
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
		
		$(document.body).append($d);
		update_draggable(event.offsetX, event.offsetY);
	})
	
	$(window).on("mousemove", function(event) {
		if(down != null)  {
			update_draggable(event.pageX - down.x, event.pageY - down.y);
		}
	})
	
	$(window).on("mouseup", function(event) {
		if(down) {
			if(out_blank()) return;
			
			var offset = $d.offset();
			if(~type.type.indexOf("static")) {
				Config.setStatic(type.id, uid);
			} else {
				if(~type.type.indexOf("resizable")) {
					Config.addResizable(type, uid, offset.left, offset.top, $d.width(), $d.height());
				} else if(~type.type.indexOf("editable")) {
					Config.addEditable(type, uid, offset.left, offset.top, type.file, 24, [0, 0, 0]);
				}
			}
		}
		
		$d.remove();
		down = null;
	});
};

ListItem.prototype.appendTo = function(root) {
	this.$item.outerWidth(root.width() / 3 - 20);
	this.$draggable.outerWidth(root.width() / 3 - 20);
	root.append(this.$item);
};

Resizable = function(type, uid, x, y, width, height, anchor) {
	var $r = this.$root = $("<div></div>");
	var $i = this.$image = $("<img />");
	var $s = this.$resize = $("<img src='/img/tools/resize.png' />");
	var $d = this.$delete = $("<img src='/img/tools/delete.png' />");
	
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
			if(out_blank()) { $d.click(); return; };
			
			var offset = $d.offset();
			Config.changeResizable(anchor, offset.left, offset.top, $d.width(), $d.height());
		}
		
		$d.remove();
		down = null;
	});
	
	$d.on("click", function(event) {
		Config.remove(anchor);
	});
	
	$r.append($i).append($s).append($d);
	
	$(document.body).append($r);
};

Editable = function() {
	
};