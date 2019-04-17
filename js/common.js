/**
 * 
 */
function callRemoteFunction(group, name, data, listener, type) {
	data["method"] = name;
	
	var async = true;
	if("async" in data){
		async = data["async"];
		delete data["async"];
	}
	
	var XHR;
	
	var request = {
		type: "post",
		url: "/api/rfc.php?" + group,
		data: data,
		async: async
	}
	
	if(type == "blob") {
		request.xhr = function() {
			XHR = new XMLHttpRequest();
			XHR.responseType = "blob";
			return XHR;
 		}
	} else {
		request.dataType = type || "json"
	}
	
	$.ajax(request).always(listener);
	return XHR;
}

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

callRemoteFunction("tools", "const", { async: false }, function(response) {
	for(var name in response.body) {
		window[name] = response.body[name]; 
	}
});

var currentArrowDirection = "down";
$(window).on("scroll", function() {
	var scroll = document.scrollingElement; 
	
	var animation = null, deg;
	if(scroll.scrollTop > scroll.scrollTopMax / 2) {
		if(currentArrowDirection == "down") {
			animation = "scroll-arrow-up-rotation";
			deg = 180;
			currentArrowDirection = "up";
		}
	} else {
		if(currentArrowDirection == "up") {
			animation = "scroll-arrow-down-rotation";
			deg = 0;
			currentArrowDirection = "down";
		}
	}
	
	if(animation != null) {
		$("#down").css("animation", animation + " 0.300s linear");
		setTimeout(function() {
			$("#down").css("transform", "rotate(" + deg + "deg)");
		}, 300);	
	}
});

$("a[href^=#]").on("click", function(event) {
	if(this.href.endsWith("down")) {
		event.preventDefault();
		var scroll = document.scrollingElement; 
		$(document.scrollingElement).animate({
			scrollTop: scroll.scrollTop >= scroll.scrollTopMax / 2 ? 0 : scroll.scrollTopMax
		});
	}
	
	$(window).trigger("onanchorclick", [event, this.href.split("#")[1]]);
});

/**
 * CONTROLS BY USER RULE
 */
var lastUserRole;
function updateControls() {
	var currentUserRole = currentRole();
	
	if(!lastUserRole && currentUserRole == USER_ROLE_GUEST) {
		return;
	}
	
    if(lastUserRole != currentUserRole) {
    	lastUserRole = currentUserRole;
    	
    	var href1, href2, src1, src2;
    	
    	if(currentUserRole == USER_ROLE_GUEST) {
    		href1 = "#signup";
    		href2 = "#signin";
    		
    		src1 = "/img/user/sign_up.png";
    		src2 = "/img/user/sign_in.png";
        } else {
        	href1 = "/user.php";
    		href2 = "#signout";
    		
    		src1 = "/img/user/user.png";
    		src2 = "/img/user/sign_out.png";
        }
    	
    	$("#sign-controls img").css("animation", "sign-control-rotation 0.3s linear");
    	
    	setTimeout(function() {
    		$("#first-ctrl-link").attr("href", href1);
    		$("#second-ctrl-link").attr("href", href2);
    		$("#first-ctrl-img").attr("src", src1);
    		$("#second-ctrl-img").attr("src", src2);
    		
    		setTimeout(function() {
        		$("#first-ctrl-img").css("animation", "");
    			$("#second-ctrl-img").css("animation", "");
    		}, 150);
    	}, 150);
    }
    
    CONTROLS_UPDATER = setTimeout(updateControls, 2500);
}

updateControls();

$(window).bind("onrolechange", function(event) {
	clearTimeout(window["CONTROLS_UPDATER"]);
	updateControls();
});