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

const SPLASH_ANIMATION_TIME = 1500;
const SPLASH_TIMEOUT = 8500;

var currentSplash = 0;
function showNextSplash() {
	if(++currentSplash > 5) {
		currentSplash = 1;
    };
	
	$("#splash-1").attr("src", "/img/splash/" + currentSplash + ".png");
    $("#splash-2").fadeOut(SPLASH_ANIMATION_TIME, function() {
        $("#splash-2").attr("src", "/img/splash/" + currentSplash + ".png").css("display", "flex");
        setTimeout(showNextSplash, SPLASH_TIMEOUT);
    });
}

$(document).ready(function() {
    showNextSplash();
});