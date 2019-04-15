/**
 * 
 */
SEGMENT_TYPES = [];

callRemoteFunction("types", "list", {}, function(types) {
	SEGMENT_TYPES = types.body;
	
	for(var i in SEGMENT_TYPES) {
		var type = SEGMENT_TYPES[i];
		var root = $("<div class='segment-container'></div>");
		var span = $("<span class='segment-title'>" + type.name + "</span>");
		var div = $("<div class='segment-list'></div>");
		
		addListener(span, div);
		
		loadType(div, type);
		
		root.append(span).append(div);
		$("#segments").append(root);
	}
});

function addListener(span, div) {
	var e = false;
	span.on("click", function() {
		var h = 0;
		if(e) {
			e = false;
		} else {
			h = 250;
			e = true;
		}
		
		div.animate({ height: h });
	});
}

function loadType(div, type) {
	callRemoteFunction("segments", "list", { type: type.id, offset: 0, count: 15 }, function(list) {
		if(~type.type.indexOf("resizable") || ~type.type.indexOf("static")) {
			for(var i in list.body) {
				loadImageSegment(div, type.id, list.body[i]);
			}
		} else {
			for(var i in list.body) {
				loadTextSegment(div, type.id, list.body[i]);
			}
		}
	});
}

function loadImageSegment(div, id, uid) {
	var xhr = callRemoteFunction("segments", "load", { type: id, uid: uid, width: $("#segments").children().innerWidth() / 3.1 }, function(){
		var img = $("<img class='segment' src='" + URL.createObjectURL(xhr.response) + "'/>");
		img.outerWidth($("#segments").children().innerWidth() / 3.1);
		
		div.append(img);
	}, "blob");
}

function loadTextSegment(div, id, uid) {
	$("#fonts").text($("#fonts").text() + " @font-face{ font-family: \"" + uid.font + "\"; src: url(\"" + uid.file +"\"); } ");
	
	var span = $("<div></div>");
	span.html(EDITABLE_SEGMENT_PREVIEW);
	span.css("font-family", uid.font);
	div.append(span);
}

$(window).on("load", function() {
	var $body = $(document.body);
	var $header = $("#header");
	var optionsWidth = $("#options").outerWidth(true);
	var segmentsWidth = $("#segments").outerWidth(true);
	
	var $content = $("#content");
	var $bench = $("#bench");
	var $blank = $("#blank");
	
	$content
		.css("margin-top", $header.outerHeight(true))
		.children()
			.outerHeight($("HTML").height() - $header.outerHeight(true));

	$bench
		.css("left", optionsWidth).width($body.outerWidth() - optionsWidth - segmentsWidth);
	
	var scale = Math.min(Math.floor($bench.width() / 210), Math.floor($bench.height() / 297));
	
	$blank
		.width(scale * 210).height(scale * 297)
		.css("margin-top", ($bench.height() - scale * 297) / 2);
	
	Config.load();

	var picker = $("#background-color");
	var bgColorPicker = new ColorPicker(picker);
	bgColorPicker.onColorPicked = function(color) {
		Config.setBackground(color);
	};
	
});