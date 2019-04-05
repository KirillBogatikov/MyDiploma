/**
 * CONTROLS BY USER RULE
 */
var lastUserRole;
function updateControls(role) {
	var $controls = $("#header-control");
	
	var currentUserRole = currentRole();
    if(lastUserRole != currentUserRole && !(currentUserRole == USER_ROLE_ADMIN  && lastUserRole == USER_ROLE_USER)) {
    	lastUserRole = currentUserRole;
    	
    	$controls.css("animation", "rotation 1s linear");
    	if(currentUserRole == USER_ROLE_GUEST) {
        	setTimeout(function() {
        		$("#first").attr("href", "#signup");
        		$("#second").attr("href", "#signin");
        		$("#first img").attr("src", "/img/user/sign_up.png");
        		$("#second img").attr("src", "/img/user/sign_in.png");
        		setTimeout(function() {
        			$controls.css("animation", "");
        		}, 900);
        	}, 100);
        } else {
        	setTimeout(function() {
        		$("#first").attr("href", "/user");
        		$("#second").attr("href", "#signout");
        		$("#first img").attr("src", "/img/user/user.png");
        		$("#second img").attr("src", "/img/user/sign_out.png");
        		setTimeout(function() {
        			$controls.css("animation", "");
        		}, 900);
        	}, 100);
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

$(window).bind("onrolechange", function(event, role) {
	clearTimeout(CONTROLS_UPDATER);
	console.log(role);
	updateControls(role);
});

/**
 * SPLASHES 
 */

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

/**
 * SCROLLING
 */

var currentArrowDirection = "down";
$(window).on("scroll", function() {
	var scroll = document.scrollingElement; 
	if(scroll.scrollTop > scroll.scrollTopMax / 2) {
		if(currentArrowDirection == "down")
			$("#down").css("animation", "up_rotation 0.300s linear");
		
		currentArrowDirection = "up";
		setTimeout(function() {
			$("#down").css("transform", "rotate(180deg)");
		}, 300);
	} else {
		if(currentArrowDirection == "up")
			$("#down").css("animation", "down_rotation 0.300s linear");
		
		currentArrowDirection = "down";
		setTimeout(function() {
			$("#down").css("transform", "rotate(0deg)");
		}, 300);
	}
});

$(window).bind("onanchorclick", function(event, click, href) {
	if(href == "down") {
		click.preventDefault();
		var scroll = document.scrollingElement; 
		$(document.scrollingElement).animate({
			scrollTop: scroll.scrollTop >= scroll.scrollTopMax / 2 ? 0 : scroll.scrollTopMax
		});
	}
});