/**
 * 
 */

Config = {
	__current: null,
	load: function() {
		var data = {};
		
		if(currentRole() == USER_ROLE_GUEST) {
			var data = localStorage.getItem("config");
			if(data && data != "null") {
				Config.__current = JSON.parse(data);
				this.__import();
				return;
			} else {
				localStorage.removeItem("config-uid");
			}
		}
		
		var uid = document.location.search.replace("?", "");
		if(uid == "") {
			uid = localStorage.getItem("config-uid");
			if(!uid || uid == null) {
				Config.create();
				return;	
			}
		} else {
			history.pushState(null, "", "http://mydiploma.ru/workbench.php");
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
	create: function() {
		callRemoteFunction("config", "create", {}, function(data) {
			Config.__current = data.body;
		});
	},
	__import: function() {
		Config.setBackground(Config.__current["bgcolor"]);
		
		for(var i in SEGMENT_TYPES) {
			var type = SEGMENT_TYPES[i];
			
			var width = $("#blank").width();
			var height = $("#blank").height();
			
			if(Config.__current[type.id]) {
				if(~type.type.indexOf("static")) {
					Config.setStatic(type.id, Config.__current[type.id]);
				} else if(~type.type.indexOf("resizable")) {
					var list = Config.__current[type.id];
					for(var i in list) {
						Config.__show_resizable(i+1, type.id, list[i].uid, list[i].x * width, list[i].y * height, list[i].width * width, list[i].height * height, "");
					}
				} else if(~type.type.indexOf("editable")) {
					var list = Config.__current[type.id];
					for(var i in list) {
						var color = [];
						for(var j in list[i].color) {
							color.push(list[i].color[j]);
						}
						Config.__show_editable(parseInt(i)+1, type.id, list[i].uid, list[i].x * width, list[i].y * height, color, list[i].size * $("#blank").width(), list[i].value);
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
			
			var config = {};
			for(var i in this.__current) {
				if(typeof this.__current[i] == 'object') {
					config[i] = [];
					for(var j in this.__current[i]) {
						if(this.__current[i][j]) {
							config[i].push(this.__current[i][j]);
						}
					}
				} else {
					config[i] = this.__current[i];
				}
			}
			
			callRemoteFunction("config", "save", { uid: this.__current.uid, config: config }, function(data) {});	
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
		Config.save();
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
	
		var index = this.__current[type].push({ uid: uid });
		this.changeResizable({
			type: type,
			index: index-1
		}, x, y, width, height);
		this.__show_resizable(index, type, uid, x, y, width, height, defSrc);
	},
	changeResizable(anchor, x, y, width, height) {
		var type = this.__current[anchor.type];
		
		if(x != FIELD_NOT_CHANGED) 
			type[anchor.index].x = x / $("#blank").width();
		if(y != FIELD_NOT_CHANGED) 
			type[anchor.index].y = y / $("#blank").height();
		if(width != FIELD_NOT_CHANGED) 
			type[anchor.index].width = width / $("#blank").width();
		if(height != FIELD_NOT_CHANGED) 
			type[anchor.index].height = height / $("#blank").height();
		 
		Config.save();
	},
	__show_editable: function(index, type, uid, x, y, color, size, value) {
		var editable = new Editable({
			type: type,
			index: index-1
		}, uid, x, y, color, size, value);
	},
	addEditable: function(type, uid, x, y, color, size, value) {
		type = type.id;
		if(!this.__current[type]) {
			this.__current[type] = [];
		}
		
		var index = this.__current[type].push({ uid: uid });
		this.changeEditable({
				type: type, 
				index: index-1
		}, x, y, uid, color, size, value);
		this.__show_editable(index, type, uid, x, y, color, size, value);
	},
	changeEditable(anchor, x, y, uid, color, size, value) {
		var type = this.__current[anchor.type];
		
		if(x != FIELD_NOT_CHANGED) 
			type[anchor.index].x = x / $("#blank").width();
		if(y != FIELD_NOT_CHANGED) 
			type[anchor.index].y = y / $("#blank").height();
		if(uid != FIELD_NOT_CHANGED) 
			type[anchor.index].uid = uid;
		if(color != FIELD_NOT_CHANGED) 
			type[anchor.index].color = color;
		if(size != FIELD_NOT_CHANGED) 
			type[anchor.index].size = size / $("#blank").width();
		if(value != FIELD_NOT_CHANGED) 
			type[anchor.index].value = value;	 
		
		Config.save();	
	},
	remove: function(anchor) {
		var type = this.__current[anchor.type];
		//this.__current[anchor.type] = type.slice(0, anchor.index).concat(type.slice(anchor.index + 1));
		delete this.__current[anchor.type][anchor.index];
		Config.save();
	},
	setBackground: function(color) {
		this.__current.bgcolor = [color[0], color[1], color[2], 255];
		$("#blank").css("background", "rgba(" + color.join(",") + ")"); 
		Config.save();
	}
}