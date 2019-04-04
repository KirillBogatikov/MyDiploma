var lastUserRole;
function updateControls() {
	var $user = $("#header-control-user");
	var $guest = $("#header-control-guest");
	
	var currentUserRole = currentRole();
    if(currentUserRole != lastUserRole) {
    	lastUserRole = currentUserRole;
        if(currentUserRole == USER_ROLE_GUEST) {
        	$user.animate({
                right: -$("#controls").width() * 1.5
            }, {
            	duration: 200,
                complete: function() { 
                	$user.fadeOut(0);
                    $guest.fadeIn(0).animate({
                        right: 0	                	
                    }, 200);
                }
            });
        } else {
        	$guest.animate({
                right: -$("#controls").width() * 1.5
            }, {
                duration: 200,
                complete: function() { 
                	$guest.fadeOut(0);
                	$user.fadeIn(0).animate({
                        right: 0                        
                    }, 200);
                }
            });
            
        }
    }
    CONTROLS_UPDATER = setTimeout(updateControls, 1000);
}

if(currentRole() == USER_ROLE_GUEST) {
	$("#header-control-guest").fadeIn(400);
} else {
	$("#header-control-user").fadeIn(400);
}

CONTROLS_UPDATER = setTimeout(updateControls, 1000);

$(window).bind("onrolechange", function() {
	clearTimeout(CONTROLS_UPDATER);
	updateControls();
});