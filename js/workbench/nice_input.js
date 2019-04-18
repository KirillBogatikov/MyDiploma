/**
 * 
 */

NiceInput = function(parent, hint, small, big) {
    var $c = this.$container = $("<div class='nice-input-container'></div>");
    parent.append($c);
    $c.outerWidth($c.width());
    $c.outerWidth($c.outerWidth() - ($c.outerWidth(true) - $c.outerWidth()));

    var $i = this.$input = $("<input class='nice-input-input'></input>");
    $c.append($i);
    var thiz = this;
    $i.on("keydown", function(event) {
        thiz.invalid(false);
    });
    
    var $h = this.$hint = $("<span class='nice-input-hint'>" + hint + "</span>");
    $c.append($h);
    $h.outerWidth($h.width());
    $h.offset({ left: $h.offset().left - $c.width() });
    
    var focused = false;

    $h.on("click", function() {
        $i.focus();
    });
    $i.on("focus", function(event) {
    	$c.attr("ui-focused", true);
        $i.attr("ui-focused", true);
        $h.attr("ui-focused", true);
    	
        if(focused) { return; }
        
        $h.attr("shifted", true);
        
        var $h_offset = $h.offset().top;
        var $c_offset = $c.offset().top;
        var off = $h_offset - $c_offset + $h.outerHeight() / 2 - 7;
        
        $h.animate({
            "font-size": small,
            "margin-top": -off
        }, 200, function(){ focused = true; });
    });
    $i.on("blur", function(event) {
    	$c.removeAttr("ui-focused");
        $i.removeAttr("ui-focused");
        $h.removeAttr("ui-focused");
        
        if($i.val().trim().length == 0) {
            $h.removeAttr("shifted");
            $h.animate({
                "font-size": big,
                "margin-top": 0
            }, 200, function() { focused = false; });
        }
    });
};

NiceInput.prototype.invalid = function(inv) {
    if(inv) {
        this.$container.attr("ui-invalid", true);
        this.$input.attr("ui-invalid", true);
        this.$hint.attr("ui-invalid", true);
    } else {
        this.$container.removeAttr("ui-invalid");
        this.$input.removeAttr("ui-invalid");
        this.$hint.removeAttr("ui-invalid");
    }
};