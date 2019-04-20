/**
 * 
 */

NiceInput = function(parent, hint, type) {
	var $c = this.$container = $("<div class='container'></div>");
	parent.append($c);
	
	var $i = this.$input = $("<input class='input' type='" + type + "'/>");
	$c.append($i);
	$c.height($i.outerHeight(true));
	
	var $h = this.$hint = $("<span class='hint'>" + hint + "</span>");
	$h.css("top", -$i.outerHeight(true));
	$c.append($h);

	$h.on("click", function() {
		$i.focus();
	});

	$i.on("focus", function() {
		$c.attr("focused", true);
		$i.attr("focused", true);
		$h.attr("focused", true);
		
		$h.animate({
			top: -$i.outerHeight(true) - $h.outerHeight(true) / 1.5,
			left: $c.css("padding-left")
		});
	});
	$i.on("blur", function() {
		$c.removeAttr("focused");
		$i.removeAttr("focused");
		$h.removeAttr("focused");
		
		if($i.val().length == 0) {
			$h.animate({
				top: -$i.outerHeight(true),
				left: 0
			});
		}
	});
};

NiceInput.prototype.invalid = function(inv) {
    if(inv) {
        this.$container.attr("invalid", true);
        this.$input.attr("invalid", true);
        this.$hint.attr("invalid", true);
    } else {
        this.$container.removeAttr("invalid");
        this.$input.removeAttr("invalid");
        this.$hint.removeAttr("invalid");
    }
};