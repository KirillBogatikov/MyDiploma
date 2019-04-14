/**
 * 
 */

const SEGMENTS_COUNT_PER_TIME = 3;

var SEGMENT_TYPES_LIST;

function loadTypesList() {
	callRemoteFunction("types", "list", { async: false }, function(data) {
		SEGMENT_TYPES_LIST = data.body;
	});
}

function viewSegment(id, uid, width, height) {
	var data = {
		type: id,
		uid: uid
	};
	
	if(width) {
		data.width = width;
	}
	
	if(height) {
		data.height = height;
	}
	
	var myXHR = callRemoteFunction("segments", "load", data, function(blob){
		
	}, "blob");
}

function listSegments(id, offset) {
	callRemoteFunction("segments", "list", {
		type: id,
		offset: offset,
		count: SEGMENTS_COUNT_PER_TIME
	}, function(data) {
		for(var i = 0; i < data.body.length; i++) {
			viewSegment(id, data.body[i], 210, 297);
		}
	});
}

SegmentList = function($parent) {
	var $r = this.$root = $parent || $("<div></div>");
	var $t = this.$title = $("<span class='slist-title'></span>");
	var $c = this.$content = $("<div id='slist-content'></div>");
	var ex = false;
	
	$t.on("click", function() {
		var height = 0;
		if(!ex) {
			height = SegmentList.HEIGHT;
			ex = true;
		} else {
			ex = false;
		}
		
		$c.animate({
			height: height 
		}, 200);
	});
	
	$r.append($t).append($c);
}