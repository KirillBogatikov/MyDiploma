callRemoteFunction("user", "read", {}, function(data) {
	if(data.code != RFC_SUCCESS) return;
	
	var user = data.body;

	var login = new NiceInput($("#login"), "Логин", "text");
	login.$container.css("display", "inline-block");
	login.$input.val(user.login).attr("spellcheck", false);
	login.$input.focus();

	var id = new NiceInput($("#id"), "ID", "text");
	id.$container.css("display", "inline-block");
	id.$input.val(user.id).attr("spellcheck", false).attr("readonly", true);
	id.$input.focus();

	var name = new NiceInput($("#name"), "Имя", "text");
	name.$container.css("display", "inline-block");
	name.$input.val(user.name).attr("spellcheck", false);
	name.$input.focus();

	var surname = new NiceInput($("#surname"), "Фамилия", "text");
	surname.$container.css("display", "inline-block");
	surname.$input.val(user.surname).attr("spellcheck", false);
	surname.$input.focus();
	surname.$input.blur();
	
	$("#save").on("click", function() {
		save(login, name, surname);
	});
});

var LOADING_IMAGES = 0;
var LOCK = new ModalWindow();
LOCK.show();

function loadUserData() {
	callRemoteFunction("config", "list", {}, function(data) {
		if(data.code != RFC_SUCCESS) return;
	
		var cfgs = data.body;
		if(cfgs.length == 0) {
			$("#works-images").append("У Вас еще нет ниодной работы").width("100%");
		} else {
			LOADING_IMAGES += cfgs.length;
		}
		
		for(var i in cfgs) {
			viewWork(cfgs[i]);
		}
	});
	
	callRemoteFunction("user", "uploads", {}, function(data) {
		if(data.code != RFC_SUCCESS) return;
	
		var upls = data.body;
		if(upls.length == 0) {
			$("#uploads-images").append("Вы не загружали файлы").width("100%");
		} else {
			LOADING_IMAGES += upls.length;
		}
		
		for(var i in upls) {
			viewWork(upls[i]);
		}
	});
}

var THUMB_WIDTH, THUMB_HEIGHT;

$(window).on("load", function() {
	var width = $("#works").outerWidth();
	
	count = Math.min(Math.max(3, Math.floor(width / 210)), 7);
	
	THUMB_WIDTH = width / count;
	THUMB_HEIGHT = THUMB_WIDTH * 297 / 210;
	$("#works-images").height(THUMB_HEIGHT);
	$("#uploads-images").height(THUMB_HEIGHT);
	
	loadUserData();
	
	var check = function() {
		if(LOADING_IMAGES == 0) {
			LOCK.hide();
		} else {
			setTimeout(check, 500);
		}
	};
	check();
});

function viewWork(cfg) {
	var xhr = callRemoteFunction("config", "draw", { uid: cfg, width: THUMB_WIDTH, height: THUMB_HEIGHT }, function(data) {
		var blob = URL.createObjectURL(xhr.response);
		var img = $("<img src='" + blob + "'/>");
		img.on("load", function() { 
			LOADING_IMAGES--;
        });
		
		$("#works-images").append(img);
		(function(img, uid){
			img.on("click", function() {
				document.location.href = "/workbench.php?" + uid;
			});
		})(img, cfg);
		$("#works-images").outerWidth($("#works-images").width() + THUMB_WIDTH + 10);
	}, "blob"); 
}

function viewUpload(uid) {
	var xhr = callRemoteFunction("user", "upload", { uid: uid, width: THUMB_WIDTH, height: THUMB_HEIGHT }, function(data) {
		var blob = URL.createObjectURL(xhr.response);

		var img = $("<img src='" + blob + "'/>");
		img.on("load", function() { 
			LOADING_IMAGES--;
        });
		
		$("#uploads-images").append(img);
		$("#uploads-images").outerWidth($("#uploads-images").width() + THUMB_WIDTH + 10);
	}, "blob"); 
}

function save(login, name, surname) {
	var error = $("#error");
	callRemoteFunction("user", "save", { name: name.$input.val(), surname: surname.$input.val(), login: login.$input.val() }, function(response) {
		if(response.code == RFC_SUCCESS) {
			error.html("Изменения сохранены");
			setTimeout(function() {
				error.fadeOut(400, function() {
					error.html("");
					error.fadeIn();
				});
			}, 600);
			return;
		}
		
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
	});
}

function deleteUser() {
	var container = $('<div class="sign-container"></div>');
	var window = new ModalWindow(container);
	window.show();
	
	var title = $('<div class="sign-title">Удаление</div>');
	container.append(title);
	
	var text = $("<div style='font-size:85%'>Вы уверены, что хотите удалить аккаунт? Отменить это действие будет не возможно</div>");
	container.append(text);
	
	var ok = $("<button class='sign-button'>Да</button>");
	ok.on("click", function() {
		__AUTH_MODAL_WINDOW.show();
		callRemoteFunction("user", "delete", {}, function(response) {
			document.location.href = "/";
		});
	});
	container.append(ok);
	
	var cancel = $("<button class='sign-button'>Отмена</button>");
	cancel.on("click", function() {
		window.hide();
	});
	container.append(cancel);
	
}

function changePassword() {
	var $c = $('<div class="sign-container"></div>');
	var window = new ModalWindow($c);
	window.show();
	
	var title = $('<div class="sign-title">Изменение пароля</div>');
	$c.append(title);
	
	var $m = $('<div class="sign-message"></div>');
	$c.append($m);
	
	var oldPass = new NiceInput($c, "Старый пароль", "password");
	var newPass = new NiceInput($c, "Новый пароль", "password");
	
	var $s = $("<button class='sign-button'>OK</button>");
	$c.append($s);
	$s.on("click", function() {
		$m.html("");
		callRemoteFunction("user", "save", { old_password: oldPass.$input.val(), new_password: newPass.$input.val() }, function(response) {
			if(response.code == RFC_SUCCESS) {
				var error = $("#error");
				error.html("Изменения сохранены");
				setTimeout(function() {
					window.hide();
					error.fadeOut(400, function() {
						error.html("");
						error.fadeIn();
					});
				}, 600);
				return;
			}
			
			switch(response.body.password) {
				case USER_INVALID:
					$m.html($m.html() + "Пароль может содержать символы латинского алавита, цифры, символы @, #, $, %, &, +, - и символ подчеркивания<br/>");
					newPass.invalidate(true);
				break;
				case USER_INVALID_SHORT:
					$m.html($m.html() + "Пароль должен содержать 8 и более символов<br/>");
					newPass.invalidate(true);
				break;
				case USER_INVALID_LONG:
					$m.html($m.html() + "Пароль должен содержать менее 32 символов<br/>");
					newPass.invalidate(true);
				break;
				case ACCESS_DENIED:
					$m.html($m.html() + "Старый пароль введен неверно");
					oldPass.invalidate(true);
				break;
			}
		});
	});
	
	var $l = $("<button class='sign-button'>Отмена</button>");
	$c.append($l);
	$l.on("click", function(){
		window.hide();
	});
}