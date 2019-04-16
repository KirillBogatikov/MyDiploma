/**
 * 
 */

Config = {
	__current: null,
	load: function() {
		var data = {};
		
		if(currentRole() == USER_ROLE_GUEST) {
			var data = localStorage.getItem("config");
			if(data) {
				Config.__current = JSON.parse(data);
				this.__import();
				return;
			} else {
				localStorage.removeItem("config-uid");
			}
		}
		
		var uid = localStorage.getItem("config-uid");
		if(!uid) {
			callRemoteFunction("config", "create", {}, function(data) {
				Config.__current = data.body;
			});
			return;
		}
		
		callRemoteFunction("config", "load", { uid: uid }, function(data) {
			if(data.body == RFC_NOT_FOUND) {
				localStorage.removeItem("config-uid");
				Config.load();
			} else {
				Config.__current = data.body;
				Config.__import();
			}
		});
	},
	__import: function() {
		Config.setBackground(Config.__current["bgcolor"]);
		
		for(var i in SEGMENT_TYPES) {
			var type = SEGMENT_TYPES[i];
			
			if(Config.__current[type.id]) {
				if(~type.type.indexOf("static")) {
					Config.setStatic(type.id, Config.__current[type.id]);
				} else if(~type.type.indexOf("resizable")) {
					var list = Config.__current[type.id];
					for(var i in list) {
						Config.__show_resizable(i+1, type.id, list[i].uid, list[i].x, list[i].y, list[i].width, list[i].height, "");
					}
				}
			}
		}
	},
	save: function() {
		if(currentRole() == USER_ROLE_GUEST) {
			localStorage.setItem("config", JSON.stringify(this.__current));
		} else {
			localStorage.setItem("config-uid", this.__current.uid);
			
			callRemoteFunction("config", "save", { uid: this.__current.uid, config: this.__current }, function(data) {});	
		}
	},
	setStatic: function(type, uid) {
		var $blank = $("#blank");
		this.__current[type] = uid;
		
		var xhr = callRemoteFunction("segments", "load", {
			type: type,
			uid: uid,
			width: $blank.width(),
			height: $blank.height()
		}, function(data) {
			$("#" + type).attr("src", URL.createObjectURL(xhr.response));
		}, "blob")
	},
	__show_resizable: function(index, type, uid, x, y, width, height, defSrc) {
		var resizable = new Resizable(type, uid, x, y, width, height, {
			type: type,
			index: index-1
		}, defSrc);
	},
	addResizable: function(type, uid, x, y, width, height, defSrc) {
		type = type.id;
		if(!this.__current[type]) {
			this.__current[type] = [];
		}
	
		var index = this.__current[type].push({ uid: uid, x: x, y: y, width: width, height: height });
		this.__show_resizable(index, type, uid, x, y, width, height, defSrc);
	},
	changeResizable(anchor, x, y, width, height) {
		var type = this.__current[anchor.type];
		
		if(x != FIELD_NOT_CHANGED) 
			type[anchor.index].x = x;
		if(y != FIELD_NOT_CHANGED) 
			type[anchor.index].y = y;
		if(width != FIELD_NOT_CHANGED) 
			type[anchor.index].width = width;
		if(height != FIELD_NOT_CHANGED) 
			type[anchor.index].height = height;
		
	},
	__show_editable: function(index, type, x, y, font, color, size, value) {
		var editable = new Editable(type, uid, x, y, font, color, size, value, {
			type: type,
			index: index-1
		});
		editable.appendTo($("#blank"));
	},
	addEditable: function(type, x, y, font, color, size, value) {
		type = type.id;
		if(!this.__current[type]) {
			this.__current[type] = [];
		}
		
		var index = this.__current[type].push({ x: x, y: y, font: font, color: color, size: size, value: value });
		this.__show_editable(index, type, x, y, font, color, size, value);
	},
	changeEditable(anchor, x, y, font, color, size, value) {
		var type = this.__current[anchor.type];
		
		if(x != FIELD_NOT_CHANGED) 
			type[anchor.index].x = x;
		if(y != FIELD_NOT_CHANGED) 
			type[anchor.index].y = y;
		if(font != FIELD_NOT_CHANGED) 
			type[anchor.index].font = font;
		if(color != FIELD_NOT_CHANGED) 
			type[anchor.index].color = color;
		if(size != FIELD_NOT_CHANGED) 
			type[anchor.index].size = size;
		if(value != FIELD_NOT_CHANGED) 
			type[anchor.index].value = value;		
	},
	remove: function(anchor) {
		var type = this.__current[anchor.type];
		this.__current[anchor.type] = type.slice(0, anchor.index).concat(type.slice(anchor.index + 1));
	},
	setBackground: function(color) {
		this.__current.bgcolor = [color[0], color[1], color[2], 255];
		$("#blank").css("background", "rgba(" + color.join(",") + ")");
	}
}