/**
 * 
 */

String.prototype.replaceAll = function(a, b) {
	var s = this.toString();
	while(s.indexOf(a) != -1) {
		s = s.replace(a, b);
	}
	return s;
};

$(window).on("load", function() {
	$("#content").css("margin-top", $("#header").outerHeight(true))
})

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

$(window).bind("onanchorclick", function(event, click, anchor) {
	if(anchor.startsWith("sign")) {
		click.preventDefault();
		switch(anchor) {
			case "signin": showSignIn(); break;
			case "signup": showSignUp(); break;
			case "signout": signout(); break;
		}
	}
});

function showSignIn() {
	var shadow = $('<div class="sign-shadow"></div>');
	$(document.body).append(shadow);
	shadow.on("click", function(event) {
		if(event.target == shadow[0]) {
			shadow.fadeOut(200, function() {
				shadow.remove();
			});
		}
	})
	var container = $('<div class="sign-container"></div>');
	shadow.append(container);
	var title = $('<div class="sign-title">Вход</div>');
	container.append(title);
	var error = $('<div class="sign-error"></div>');
	container.append(error);
	
	var login = new NiceInput(container, "Логин", "text");
	var passw = new NiceInput(container, "Пароль", "password");
	
	var submit = $('<button class="sign-submit">Ок</button>');
	submit.on("click", function() {
		var response = signin(login.$input.val(), passw.$input.val());
		switch(response.code) {
			case AUTH_NO_USER:
				login.invalidate(true);
				error.html("Пользователь с таким логином не найден");
			break;
			case RFC_FAIL: 
				passw.invalidate(true);
				error.html("Пароль не верен"); 
			break;
			case RFC_SUCCESS:
				error.html("Вход выполнен");
				shadow.fadeOut(200, function() {
					shadow.remove();
				});
			break;
		}
		console.log(response);
	});
	container.append(submit);
	
	shadow.css("display", "flex").hide();
	shadow.fadeIn(200);
}

function showSignUp() {
	var shadow = $('<div class="sign-shadow"></div>');
	$(document.body).append(shadow);
	shadow.on("click", function(event) {
		if(event.target == shadow[0]) {
			shadow.fadeOut(200, function() {
				shadow.remove();
			});
		}
	})
	var container = $('<div class="sign-container"></div>');
	shadow.append(container);
	var title = $('<div class="sign-title">Регистрация</div>');
	container.append(title);
	var error = $('<div class="sign-error"></div>');
	container.append(error);
	
	var login = new NiceInput(container, "Логин", "text");
	var passw = new NiceInput(container, "Пароль", "password");
	var name = new NiceInput(container, "Имя", "password");
	var surname = new NiceInput(container, "Фамилия", "password");
	
	var submit = $('<button class="sign-submit">Ок</button>');
	submit.on("click", function() {
		var response = signup(login.$input.val(), passw.$input.val(), name.$input.val(), surname.$input.val());
		if(response.code == USER_LOGIN_BUSY) {
			login.invalidate(true);
			error.html("Пользователь с таким логином существует");
		} else if(response.code == RFC_SUCCESS) {
			error.html("Регистрация выполнена");
			shadow.fadeOut(200, function() {
				shadow.remove();
			});
		} else {
			switch(response.body.login) {
				case USER_INVALID:
					error.html("Логин может содержать символы латинского алавита, цифры, символ @ и символ подчеркивания<br/>");
					login.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					error.html("Логин должен содержать 4 и более символа<br/>");
					login.invalidate(true);
				break;
				case USER_INVALID_LONG:
					error.html("Логин должен содержать менее 16 символов<br/>");
					login.invalidate(true);
				break;
			}
			switch(response.body.password) {
				case USER_INVALID:
					error.html(error.html() + "Пароль может содержать символы латинского алавита, цифры, символы @, #, $, %, &, +, - и символ подчеркивания<br/>");
					passw.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					error.html(error.html() + "Пароль должен содержать 8 и более символов<br/>");
					passw.invalidate(true);
				break;
				case USER_INVALID_LONG:
					error.html(error.html() + "Пароль должен содержать менее 32 символов<br/>");
					passw.invalidate(true);
				break;
			}
			switch(response.body.name) {
				case USER_INVALID:
					error.html(error.html() + "Имя может содержать только символы русского и латинского алфавитов<br/>");
					name.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					error.html(error.html() + "Имя должно содержать более 1 символа<br/>");
					name.invalidate(true);
				break;
				case USER_INVALID_LONG:
					error.html(error.html() + "Имя должно содержать менее 32 символов<br/>");
					name.invalidate(true);
				break;
			}
			switch(response.body.surname) {
				case USER_INVALID:
					error.html(error.html() + "Фамилия может содержать только символы русского и латинского алфавитов<br/>");
					surname.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					error.html(error.html() + "Фамилия должна содержать более 1 символа<br/>");
					surname.invalidate(true);
					break;
				case USER_INVALID_LONG:
					error.html(error.html() + "Фамилия должна содержать менее 32 символов<br/>");
					surname.invalidate(true);
				break;
			}
		}
		console.log(response);
	});
	container.append(submit);
	
	shadow.css("display", "flex").hide();	
	shadow.fadeIn(200);
}