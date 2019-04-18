/**
 * 
 */

TextEditor = function(parent, OBJ) {
	var thiz = this;
	this.uid = null;
	
	var $r = this.$root = $("<div id='texteditor-container'></div>");
	parent.append($r);
	
	var $s = this.$span = $("<span id='texteditor-title'>Параметры текста</span>");
	$r.append($s);
	var $d = this.$div = $("<div id='texteditor-div'></div>");
	$r.append($d);
	
	var n = $("<input id='texteditor-input'/>");
	$d.append(n);
	n.outerWidth(n.outerWidth() - 42)
	
	var $cp = this.$colorPicker = $("<div id='texteditor-picker'></div>");
	$d.append($cp);
	
	/*var cp = this.colorPicker = new ColorPicker($cp);
	cp.onColorPicked = function(color) {
		thiz.onColorChange(color);
	};*/
	
	var $c = this.$controls = $("<div id='texteditor-controls'></div>");
	$d.append($c);
	
	var $f = this.$font = $("<div id='texteditor-font'></div>");
	$c.append($f);
	
	var $z = this.$size = $("<div id='texteditor-size'></div>");
	$c.append($z);
	
	var $u = this.$up = $("<img src='/img/tools/font_size_up.png'/>");
	$z.append($u);
	
	var $w = this.$down = $("<img src='/img/tools/font_size_down.png'/>");
	$z.append($w);
	
	H = $d.height();
	initExpandable($s, $d, function() { if(thiz.uid == null) { return 0; } return H }, OBJ);
	//$d.height(0);
};

TextEditor.prototype.openFor = function(uid, color, size, value) {
	this.$root.removeAttr("disabled");
	this.uid = uid;
};

TextEditor.prototype.close = function() {
	this.$root.attr("disabled", "");
	this.uid = null;
	this.$span.click();
};

TextEditor.prototype.onColorChange = function(color) {};
TextEditor.prototype.onFontChange = function(font) {};
TextEditor.prototype.onSizeChange = function(size) {};