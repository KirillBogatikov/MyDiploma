TypeList = function(type) {
	this.type = type;
	var $r = this.$root = $("<div class='segment-container'></div>");
	var $s = this.$span = $("<span class='segment-title'>" + type.name + "</span>");
	var $l = this.$list = $("<div class='segment-list'></div>");
	$r.append($s).append($l);
	
	var ex = false;
	$s.on("click", function() {
		var h = 0;
		if(ex) {
			ex = false;
			TypeList.currentExpanded = null;
		} else {
			h = TypeList.MAX_HEIGHT;
			ex = true;
			
			var exp = TypeList.currentExpanded; 
			if(exp && exp[0] != $s[0]) {
				exp.click();
			}	
			TypeList.currentExpanded = $s;
		}
		
		$l.animate({ height: h });
	});
	
	var thiz = this;
	$l.on("scroll", function() {
		if($l[0].scrollTop >= $l[0].scrollTopMax * 3 / 4) {
			thiz.load();
		}
	});
}

TypeList.prototype.load = function() {
	if(this.isLoading) {
		return;
	}
	
	this.isLoading = true;
	var offset = this.$list.children().length;
	var thiz = this;
	
	var width = thiz.$list.width() / 3 - 20;
	callRemoteFunction("segments", "list", { type: this.type.id, offset: offset, count: Math.ceil(TypeList.MAX_HEIGHT / width) * 2 }, function(response) {
		var uids = response.body;
		for(var i in uids) {
			var item;
			
			if(~thiz.type.type.indexOf("editable")) {
				item = new TextListItem(thiz.type, uids[i], width);
			} else {
				item = new ListItem(thiz.type, uids[i], width);
			}
			
			item.appendTo(thiz.$list);
		}
		
		thiz.isLoading = false;
	});
};

TypeList.prototype.appendTo = function(root) {
	root.append(this.$root);
};