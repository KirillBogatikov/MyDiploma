/**
 * 
 */
SEGMENT_TYPES = [];
TYPE_LISTS = [];

var LOADING_VIEWS = 0;
var LOCK = new ModalWindow();
LOCK.show();

function loadData() {
	callRemoteFunction("types", "list", {}, function(types) {
		SEGMENT_TYPES = types.body;
		
		Config.load();
		
		for(var i in SEGMENT_TYPES) {
			var type = SEGMENT_TYPES[i];
			var list = new TypeList(type);
			list.appendTo($("#segments"));
			
			TYPE_LISTS.push(list);
		}
		
		console.log($("#segments").height());
		TypeList.MAX_HEIGHT = $("#segments").height() - $(".segment-container").outerHeight(true) * (SEGMENT_TYPES.length+1);
		
		for(var i in TYPE_LISTS) {
			TYPE_LISTS[i].load();
		}
		
		check = function() {
			if(LOADING_VIEWS == 0) {
				LOCK.hide();
			} else {
				setTimeout(check, 500);
			}
		};
		setTimeout(check, 500);
	});
}

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
	$("#texteditor-font").outerWidth(ctrl * 0.6-14).outerHeight(35);
	$("#texteditor-size").outerWidth(ctrl * 0.4).outerHeight(35);
	
	var H = $("#texteditor-content").height(); 
	initExpandable($("#texteditor-title"), $("#texteditor-content"), function(){ return H; }, Options);
	$("#texteditor-content").outerHeight(0);
	
	loadData();
});

$(window).bind("onanchorclick", function(event, click, anchor) {
	if(anchor == "new") {
		click.preventDefault();
		Config.save();
		Config.create();
		Config.save();
		document.location.href = document.location.href + " ";
	}
});

function download() {
	var $c = $("<div class='downloading-window'></div>");
	var window = new ModalWindow($c);
	
	var $t = $("<div class='downloading-title'>Загрузка файла</div>");
	$c.append($t);
	
	var $o = $("<div class='downloading-options'></div>");
	$c.append($o);
	var $l = $("<span>Выберите качество: </span>");
	$o.append($l);
	
	var $s = $("<select class='downloading-quality'></select>");
	$o.append($s);
	$s.append("<option value='1920'>Full HD</option>");
	$s.append("<option value='1440'>HD 1080</option>");
	$s.append("<option value='720'>HD 720</option>");
	$s.append("<option value='576'>SD 576</option>");
	$s.append("<option value='480'>SD 480</option>");
	var $m = $("<div>и дождитесь загрузки предпросмотра</div>");
	$o.append($m);
	
	var $d;
	var $p = $("<img class='downloading-preview'/>");
	$c.append($p);
	$s[0].onchange = function() {
		$m.fadeIn(200);
		$d.fadeOut(200);
		var height = $s.val();
		var width = height * 210 / 297;
		
		var uid = Config.__current.uid;
		if(currentRole() == USER_ROLE_GUEST) {
			uid = Config.__export();
		}
		
		var xhr = callRemoteFunction("config", "draw", { uid: uid, width: width, height: height }, function(data) {
			var blob = URL.createObjectURL(xhr.response);
			$p.attr("src", blob);
			//console.log(data);
		}, "blob");
	};
	$p.on("load", function() {
		$m.fadeOut(200);
		$d.fadeIn(200);
		$d.attr('href', $p.attr('src'));
	});

	var $d = $("<a download='download.png'><button class='downloading-button'>Скачать</button></a>");
	$o.append($d);
	window.show();
};