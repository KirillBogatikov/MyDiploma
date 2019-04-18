/**
 * 
 */
SEGMENT_TYPES = [];
TYPE_LISTS = [];

callRemoteFunction("types", "list", {}, function(types) {
	SEGMENT_TYPES = types.body;
	
	Config.load();
	
	for(var i in SEGMENT_TYPES) {
		var type = SEGMENT_TYPES[i];
		var list = new TypeList(type);
		list.appendTo($("#segments"));
		
		TYPE_LISTS.push(list);
	}
	
	TypeList.MAX_HEIGHT = $("#segments").height() - $(".segment-container").outerHeight(true) * SEGMENT_TYPES.length;
	
	for(var i in TYPE_LISTS) {
		TYPE_LISTS[i].load();
	}
});

window.ondragstart = function() { return false; };
window.onbeforeunload = function(event) { 
	Config.save();
};

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
	
	callRemoteFunction("segments", "list", { type: "text" }, function(data) {
		data = data.body;
		for(var i in data) {
			$("#fonts").text($("#fonts").text() + " @font-face{ font-family: \"" + data[i].font + "\"; src: url(\"" + data[i].file + "\"); } ");
			var item = $("<option value='" + JSON.stringify(data[i]) + "'>" + data[i].font + "</option>");
			$("#editor-font").append(item);
		}
	});
});

$(window).bind("onanchorclick", function(event, click, anchor) {
	if(anchor == "new") {
		click.preventDefault();
		Config.create();
		Config.save();
		document.location.href = document.location.href + " ";
	}
});