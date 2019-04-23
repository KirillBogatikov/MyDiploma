/**
 * STRING ENHANCEMENT
 */

String.prototype.replaceAll = function(a, b) {
	var s = this.toString();
	while(s.indexOf(a) != -1) {
		s = s.replace(a, b);
	}
	return s;
};


ModalWindow = function(isLoading) {
	var $c = this.$container = $("<div class='modal-container'></div>");
	$(document.body).append($c);
	
	var $w;
	
	if(!isLoading) {
		$w = $("<img src='/img/loading.png' class='modal-loading'/>");
	} else {
		$w = isLoading;
		$c.on("click", function(event) {
			if(event.target == $c[0]) {
				$c.fadeOut();
			}
		})
	}
	
	this.$window = $w;
	$c.append($w);
	$c.hide();
};

ModalWindow.prototype.show = function() {
	this.$container.fadeIn();
};

ModalWindow.prototype.hide = function() {
	this.$container.fadeOut();
};

/**
 * ONLOAD LISTENER
 * updates content block
 */

$(window).on("load", function() {
	$("#content").css("margin-top", $("#header").outerHeight(true))
})

/**
 * PHP RFC
 * 
 * @param group
 * @param name
 * @param data
 * @param listener
 * @param type
 * @returns
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
	
	if(data instanceof FormData) {
		request.processData = false;
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
	
	if(method == "signin" || method == "signup" || method == "signout") {
		history.pushState(null, "", "http://mydiploma.ru/" + method);
		
		switch(method) {
			case "signin": showSignIn(); break;
			case "signup": showSignUp(); break;
			case "signout": signout(); break;
		}
	}
}

/**
 * LOADING CONSTANTS
 */
callRemoteFunction("tools", "const", { async: false }, function(response) {
	for(var name in response.body) {
		window[name] = response.body[name]; 
	}
});

/**
 * ANCHOR LINK CLICK LISTENER
 */
$("a[href^=#]").on("click", function(event) {
	if(this.href.endsWith("down")) {
		event.preventDefault();
		var scroll = document.scrollingElement; 
		$(document.scrollingElement).animate({
			scrollTop: scroll.scrollTop >= scroll.scrollTopMax / 2 ? 0 : scroll.scrollTopMax
		});
	}
	
	var anchor = this.href.split("#")[1];
	$(window).trigger("onanchorclick", [event, anchor]);
	
	if(anchor.startsWith("sign")) {
		event.preventDefault();
		switch(anchor) {
			case "signin": showSignIn(); break;
			case "signup": showSignUp(); break;
			case "signout": signout(); break;
		}
	}
});

var SIGN_IN_MODAL_WINDOW;
/**
 * SHOWS SIGN UP MODAL WINDOW
 * 
 * @returns
 */
function showSignIn() {
	if(SIGN_IN_MODAL_WINDOW) {
		SIGN_IN_MODAL_WINDOW.show();
		return;
	}
	
	var $c = $("<div class='sign-container'></div>");
	var window = SIGN_IN_MODAL_WINDOW = new ModalWindow($c);
	window.show();
	
	var $t = $("<div class='sign-title'>Вход</div>");
	$c.append($t);
	
	var $m = $("<div class='sign-message'></div>");
	$c.append($m);
	
	var login = new NiceInput($c, "Логин", "text");
	var passw = new NiceInput($c, "Пароль", "password");
	
	var $s = $('<button class="sign-button">Ок</button>');
	$s.on("click", function() {
		var response = signin(login.$input.val(), passw.$input.val());
		switch(response.code) {
			case AUTH_NO_USER:
				login.invalidate(true);
				$m.html("Пользователь с таким логином не найден");
			break;
			case RFC_FAIL: 
				passw.invalidate(true);
				$m.html("Пароль не верен"); 
			break;
			case RFC_SUCCESS:
				$m.html("Вход выполнен");
				window.hide();
			break;
		}
	});
	$c.append($s);
	
	var $l = $("<button class='sign-button'>Отмена</button>");
	$l.on("click", function() {
		window.hide();
	});
	$c.append($l);
}

var SIGN_UP_MODAL_WINDOW;

function showSignUp() {
	if(SIGN_UP_MODAL_WINDOW) {
		SIGN_UP_MODAL_WINDOW.show();
		return;
	}
	
	var $c = $('<div class="sign-container"></div>');
	var window = SIGN_UP_MODAL_WINDOW = new ModalWindow($c);
	window.show();
	
	var $t = $('<div class="sign-title">Регистрация</div>');
	$c.append($t);
	var $m = $('<div class="sign-message"></div>');
	$c.append($m);
	
	var login = new NiceInput($c, "Логин", "text");
	var passw = new NiceInput($c, "Пароль", "password");
	var name = new NiceInput($c, "Имя", "text");
	var surname = new NiceInput($c, "Фамилия", "text");
	
	var $s = $('<button class="sign-button">Ок</button>');
	$s.on("click", function() {
		var response = signup(login.$input.val(), passw.$input.val(), name.$input.val(), surname.$input.val());
		
		if(response.code == USER_LOGIN_BUSY) {
			login.invalidate(true);
			$m.html("Пользователь с таким логином существует");
		} else if(response.code == RFC_SUCCESS) {
			$m.html("Регистрация выполнена");
			window.hide();
		} else {
			switch(response.body.login) {
				case USER_INVALID:
					$m.html("Логин может содержать символы латинского алавита, цифры, символ @ и символ подчеркивания<br/>");
					login.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					$m.html("Логин должен содержать 4 и более символа<br/>");
					login.invalidate(true);
				break;
				case USER_INVALID_LONG:
					$m.html("Логин должен содержать менее 16 символов<br/>");
					login.invalidate(true);
				break;
			}
			
			switch(response.body.password) {
				case USER_INVALID:
					$m.html($m.html() + "Пароль может содержать символы латинского алавита, цифры, символы @, #, $, %, &, +, - и символ подчеркивания<br/>");
					passw.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					$m.html($m.html() + "Пароль должен содержать 8 и более символов<br/>");
					passw.invalidate(true);
				break;
				case USER_INVALID_LONG:
					$m.html($m.html() + "Пароль должен содержать менее 32 символов<br/>");
					passw.invalidate(true);
				break;
			}
			
			switch(response.body.name) {
				case USER_INVALID:
					$m.html($m.html() + "Имя может содержать только символы русского и латинского алфавитов<br/>");
					name.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					$m.html($m.html() + "Имя должно содержать более 1 символа<br/>");
					name.invalidate(true);
				break;
				case USER_INVALID_LONG:
					$m.html($m.html() + "Имя должно содержать менее 32 символов<br/>");
					name.invalidate(true);
				break;
			}
			
			switch(response.body.surname) {
				case USER_INVALID:
					$m.html($m.html() + "Фамилия может содержать только символы русского и латинского алфавитов<br/>");
					surname.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					$m.html($m.html() + "Фамилия должна содержать более 1 символа<br/>");
					surname.invalidate(true);
					break;
				case USER_INVALID_LONG:
					$m.html($m.html() + "Фамилия должна содержать менее 32 символов<br/>");
					surname.invalidate(true);
				break;
			}
		}
	});
	$c.append($s);
	
	var $l = $("<button class='sign-button'>Отмена</button>");
	$l.on("click", function(){
		window.hide()
	});
	$c.append($l);
}