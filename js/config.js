/**
 * 
 */

Config = {
	__current: null,
	load: function() {
		var name = "create";
		var data = {};
		
		var uid = localStorage.getItem("config-uid");
		if(uid) {
			name = "load";
			data.uid = uid;
		}
		
		callRemoteFunction("config", name, data, function(data) {
			if(data.body == RFC_NOT_FOUND) {
				console.log("RELOAD");
				localStorage.removeItem("config-uid");
				Config.load();
			} else {
				Config.__current = data.body;
			}
		});
	},
	save: function() {
		localStorage.setItem("config-uid", this.__current.uid);
		
		callRemoteFunction("config", "save", { uid: this.__current.uid, config: this.__current }, function(data) {
			console.log(data);
		});
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
			console.log(data);
			$("#" + type).attr("src", URL.createObjectURL(xhr.response));
		}, "blob")
	},
	addResizable: function(view, type, uid, x, y, width, height) {
		if(!this.__current[type]) {
			this.__current[type] = [];
		}
		
		var resizable = new ResizableSegment(view, type);
		resizable.$dragged.offset({ left: x, top: y });
		resizable.appendTo($("#blank"));
		
		/*
		
		var el = $("<img/>");
		var xhr = callRemoteFunction("segments", "load", { type: type, uid: uid, width: width*2, height: height*2 }, function() {
			var blob = URL.createObjectURL(xhr.response);
			
			el.attr("src", blob);
			$("#blank").append(el);
		}, "blob");*/
		
		/*return { element: el, id: type + "_" + this.__current[type].push({ uid: uid, x: x, y: y, width: width, height: height }) };*/
		return type + "_" + this.__current[type].push({ uid: uid, x: x, y: y, width: width, height: height });
	},
	addEditable: function(type, x, y, font, color, size, value) {
		if(!this.__current[type]) {
			this.__current[type] = [];
		}
		
		/*var span = $("<span style='font-family:" + font + ";font-size:" + size + ";color:" + color + "'>" + value + "</span>");
		$("#blank").append(span);*/
		
		/*return { element: span, id: this.__current[type].push({ x: x, y: y, font: font, color: color, size: size, value: value }) };*/
		return this.__current[type].push({ x: x, y: y, font: font, color: color, size: size, value: value });
	},
	remove: function(id) {
		var type = id.split("_")[0];
		id = id.split("_")[1];

		this.__current[type] = this.__current[type].slice(0, id).concat(this.__current[type].slice(id+1));
	},
	setBackground: function(color) {
		this.__current.bgcolor = [color[0], color[1], color[2]];
		$("#blank").css("background", "rgba(" + color.join(",") + ")");
	}
}