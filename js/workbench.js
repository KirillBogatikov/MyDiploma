/**
 * 
 */
SEGMENT_TYPES = [];
TYPE_LISTS = [];

$("#loading-block").css("display", "flex").fadeIn();

callRemoteFunction("types", "list", {}, function(types) {
	SEGMENT_TYPES = types.body;
	
	Config.load();
	
	for(var i in SEGMENT_TYPES) {
		var type = SEGMENT_TYPES[i];
		var list = new TypeList(type);
		list.appendTo($("#segments"));
		
		TYPE_LISTS.push(list);
	}
	
	TypeList.MAX_HEIGHT = $("#segments").height() - $(".segment-container").outerHeight(true) * (SEGMENT_TYPES.length+1);
	
	for(var i in TYPE_LISTS) {
		TYPE_LISTS[i].load();
	}
	
	var f = function() {
		if(LOADING_VIEWS != -1) {
			setTimeout(f, 333);
		} else {
			$("#loading-block").fadeOut();
		}
	};
	f();
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

	var picker = $("#bgcolor-picker");
	var bgColorPicker = new ColorPicker(picker);
	bgColorPicker.onColorPicked = function(color) {
		Config.setBackground(color);
	};
	
	callRemoteFunction("segments", "list", { type: "text" }, function(data) {
		data = data.body;
		for(var i in data) {
			$("#fonts").text($("#fonts").text() + " @font-face{ font-family: \"" + data[i].font + "\"; src: url(\"" + data[i].file + "\"); } ");
			var item = $("<option value='" + JSON.stringify(data[i]) + "'>" + data[i].font + "</option>");
			item.css("font-family", data[i].font);
			$("#texteditor-font").append(item);
		}
	});
	
	Options = {};
	initExpandable($("#bgcolor-title"), $("#bgcolor-content"), function(){ return $("#bgcolor-container").width() }, Options);
	
	Options.textColorPicker = new ColorPicker($("#texteditor-picker"));
	Options.textValue = $("#texteditor-value");
	Options.textSize = $("#texteditor-size");
	Options.textFont = $("#texteditor-font");
	Options.textDelete = $("#texteditor-delete");
	
	$("#texteditor-submit").on("click", function() {
		$("#texteditor-title").click();
		Options.textColorPicker.onColorPicked = function(color) {};
		Options.textFont[0].onchange = function() {};
		Options.textValue[0].onkeyup = Options.textValue[0].onchange = function(event) {};
		Options.textSize[0].onkeyup = Options.textSize[0].onchange = function(event) {};
		Options.textDelete[0].onclick = function() {};
	});
	
	var ctrl = $("#texteditor-controls").width();
	$("#texteditor-font").outerWidth(ctrl * 0.7-5).outerHeight(35);
	$("#texteditor-size").outerWidth(ctrl * 0.3).outerHeight(35);
	
	var H = $("#texteditor-content").height(); 
	initExpandable($("#texteditor-title"), $("#texteditor-content"), function(){ return H; }, Options);
	$("#texteditor-content").outerHeight(0);
});

$(window).bind("onanchorclick", function(event, click, anchor) {
	if(anchor == "new") {
		click.preventDefault();
		Config.create();
		Config.save();
		document.location.href = document.location.href + " ";
	}
});