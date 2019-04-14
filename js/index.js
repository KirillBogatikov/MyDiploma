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
 * 
 */

if(document.location.hash) {
	var method = document.location.hash.split("#")[1];
	
	if(method == "signin" || method == "signup") {
		history.pushState(null, "", "http://mydiploma.ru/" + method);
		
		switch(method) {
			case "signin": /*signin*/ break;
			case "signup": /*signup*/ break;
		}
	}
}