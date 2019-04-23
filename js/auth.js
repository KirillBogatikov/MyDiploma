/**
 * 
 */
var __AUTH_MODAL_WINDOW;

function signin(login, password) {
	__AUTH_MODAL_WINDOW.show();
	var R;
	callRemoteFunction("auth", "signin", {
		login: login,
		password: password,
		async: false
	}, function(response) {
		__AUTH_MODAL_WINDOW.hide();
		R = response;
		__forceUpdateControls();
	});
	return R;	
}

function signup(login, password, name, surname) {
	__AUTH_MODAL_WINDOW.show();
	
	var R;
	callRemoteFunction("auth", "signup", {
		login: login,
		password: password,
		name: name,
		surname: surname,
		async: false
	}, function(response) {
		__AUTH_MODAL_WINDOW.hide();
		R = response;
		__forceUpdateControls();
	});
	return R;
}

function signout() {
	callRemoteFunction("auth", "signout", {}, function(response) {
		if(~document.location.href.indexOf("user") || ~document.location.href.indexOf("admin")) {
			document.location = "/";
		}
		__forceUpdateControls();
	});
}

function currentRole() {
	var role;
	callRemoteFunction("auth", "role", { async: false }, function(response) {
		role = response.body;
	});
	return role;
}

function __forceUpdateControls() {
	if(window["CONTROLS_UPDATER"]) {
		clearTimeout(CONTROLS_UPDATER);
	}
	__updateControls();
}

/**
 * CONTROLS BY USER RULE
 */
var __lastUserRole;
function __updateControls() {
	var currentUserRole = currentRole();
	
	if(!__lastUserRole && currentUserRole == USER_ROLE_GUEST) {
		return;
	}
	
    if(__lastUserRole != currentUserRole) {
    	__lastUserRole = currentUserRole;
    	
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
    
    CONTROLS_UPDATER = setTimeout(__updateControls, 2500);
};

$(window).on("load", function() {
	__AUTH_MODAL_WINDOW = new ModalWindow();
	__AUTH_MODAL_WINDOW.$container.css("z-index", 999);
	__updateControls();
})