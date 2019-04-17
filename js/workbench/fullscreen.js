/**
 * 
 */

var APIs = [{		
	enabled: "fullscreenEnabled",	
	request: "requestFullscreen",
	exit:    "exitFullscreen",
	change: "fullscreenchange",
}, {
	enabled: "webkitFullscreenEnabled",
	request: "webkitRequestFullscreen",
	exit:    "webkitExitFullscreen",
	change: "webkitfullscreenchange",
}, {
	enabled: "mozFullScreenEnabled",
	request: "mozRequestFullScreen",
	exit:    "mozCancelFullScreen",
	change: "mozfullscreenchange",
}, {
	enabled: "msFullscreenEnabled",
	request: "msRequestFullscreen",
	exit:    "msExitFullscreen",
	change: "MSFullscreenChange",
}];

var API;

for(var i in APIs) {
	var api = APIs[i];
	if(document[api.enabled]) {
		API = api;
		break;
	}
}

if(API) {
	$(window).bind(API.change, function(event) {
		console.log(event);
	});
}