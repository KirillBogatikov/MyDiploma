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
			console.log(data);
			
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
	addDynamicResizable: function(type, uid, x, y, width, height) {
		var el = $("<img/>");
		var xhr = callRemoteFunction("segments", "load", { type: type, uid: uid, width: width*2, height: height*2 }, function() {
			var blob = URL.createObjectURL(xhr.response);
			
			el.attr("src", blob);
			$("#blank").append(el);
		}, "blob");
		
		return { element: el, id: this.__current[type].push({ uid: uid, x: x, y: y, width: width, height: height }) };
	},
	addDynamicEditable: function(type, x, y, font, color, size, value) {
		var span = $("<span style='font-family:" + font + ";font-size:" + size + ";color:" + color + "'>" + value + "</span>");
		$("#blank").append(span);
		
		return { element: span, id: this.__current[type].push({ x: x, y: y, font: font, color: color, size: size, value: value }) };
	},
	setBackground: function(color) {
		this.__current.bgcolor = [color[0], color[1], color[2]];
		$("#blank").css("background", "rgba(" + color.join(",") + ")");
	}
}