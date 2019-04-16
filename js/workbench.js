/**
 * 
 */
SEGMENT_TYPES = [];

callRemoteFunction("types", "list", {}, function(types) {
	SEGMENT_TYPES = types.body;
	
	Config.load();
	
	for(var i in SEGMENT_TYPES) {
		var type = SEGMENT_TYPES[i];
		var list = new TypeList(type);
		list.load();
		list.appendTo($("#segments"));
	}
	
	TypeList.MAX_HEIGHT = $("#segments").height() - $(".segment-container").outerHeight(true) * SEGMENT_TYPES.length;
});

window.ondragstart = function() { return false; }

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

	var picker = $("#background-color");
	var bgColorPicker = new ColorPicker(picker);
	bgColorPicker.onColorPicked = function(color) {
		Config.setBackground(color);
	};
	
});