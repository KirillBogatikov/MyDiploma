function initExpandable(view, list, height, object) {
	var ex = false;
	view.on("click", function() {
		var h = 0;
		if(ex) {
			ex = false;
			object.currentExpanded = null;
			
		} else {
			h = height();
			ex = true;
			
			var exp = object.currentExpanded;
			if(exp && exp[0] != view[0]) {
				exp.click();
			}	
			object.currentExpanded = view;
		}
		
		list.animate({ height: h });
	});
}

TypeList = function(type) {
	this.type = type;
	var $r = this.$root = $("<div class='segment-container'></div>");
	var $s = this.$span = $("<span class='segment-title'>" + type.name + "</span>");
	var $l = this.$list = $("<div class='segment-list'></div>");
	$r.append($s).append($l);
	
	initExpandable($s, $l, function(){ return TypeList.MAX_HEIGHT; }, TypeList);
	
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