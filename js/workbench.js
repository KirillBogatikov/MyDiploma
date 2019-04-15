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
		root.append(span).append(div);
		$("#segments").append(root);
		
		addTitleClickListener(span, div);
		
		loadType(div, type, 0);
	}
	
	HGHT = $("#segments").height() - $(".segment-container").outerHeight(true)*SEGMENT_TYPES.length;
});

function addTitleClickListener(span, div) {
	span.attr("expanded", "false");
	var e = false;
	span.on("click", function() {
		var h = 0;
		if(e) {
			e = false;
		} else {
			h = HGHT;
			e = true;
			
			var exp = $("span[expanded=true]"); 
			if(exp.length > 0) {
				exp.click();
			}
				
		}
		
		span.attr("expanded", e);
		
		div.animate({ height: h });
	});
}

function loadType(div, type, offset) {
	callRemoteFunction("segments", "list", { type: type.id, offset: offset, count: 15 }, function(list) {
		var width = div.innerWidth() / 3 - 20;
		for(var i in list.body) {
			var ds = new DraggableSegment(type.type, type.id, list.body[i], width);
			
			(function(uid) {
				if(~type.type.indexOf("static")) {
					ds.onDropDown = function(x, y) {
						Config.setStatic(type.id, uid);
					};
				} else {
					if(~type.type.indexOf("resizable")) {
						ds.onDropDown = function(x, y, width, height) {
							console.log(ds.$dragged);
							Config.addResizable(ds.$dragged, type.id, uid, x, y, width, height);
						}
					}
				}
			})(list.body[i]);
			ds.appendTo(div, width);
		}
	});
}

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
	
	Config.load();

	var picker = $("#background-color");
	var bgColorPicker = new ColorPicker(picker);
	bgColorPicker.onColorPicked = function(color) {
		Config.setBackground(color);
	};
	
});