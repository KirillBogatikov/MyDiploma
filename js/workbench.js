/**
 * 
 */
SEGMENT_TYPES = [];

callRemoteFunction("types", "list", {}, function(types) {
	SEGMENT_TYPES = types.body;
	
	for(var i in SEGMENT_TYPES) {
		var type = SEGMENT_TYPES[i];
		var span = $("<span>" + type.name + "</span>");
		var div = $("<div class='height: 0px'></div>");
		
		var e = false;
		span.on("click", function() {
			var h = 0;
			if(!e) {
				h = 1000;
			}
			
			div.animate({ height: h });
		});
		
		loadType(div, type);
		
		$("#segments").append(span).append(div);
	}
});

function loadType(div, type) {
	callRemoteFunction("segments", "list", { type: type.id, offset: 0, count: 15 }, function(list) {
		console.log(type.type);
		if(~type.type.indexOf("resizable") || ~type.type.indexOf("static")) {
			for(var i in list.body) {
				loadImageSegment(div, type.id, list.body[i]);
			}
		}
	});
}

function loadImageSegment(div, id, uid) {
	var xhr = callRemoteFunction("segments", "load", { type: id, uid: uid, width: 210 }, function(){
		div.append($("<img width='" + $("#segments").width() / 3.1 + "' src='" + URL.createObjectURL(xhr.response) + "'/>"));
	}, "blob");
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