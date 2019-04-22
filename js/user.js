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

callRemoteFunction("config", "list", {}, function(data) {
	if(data.code != RFC_SUCCESS) return;

	var cfgs = data.body;
	if(cfgs.length == 0) {
		$("#works-images").append("У Вас еще нет ниодной работы").width("100%");
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
	}
	
	for(var i in upls) {
		viewWork(upls[i]);
	}
});

var THUMB_WIDTH, THUMB_HEIGHT;

$(window).on("load", function() {
	var width = $("#works").outerWidth();
	
	count = Math.min(Math.max(3, Math.floor(width / 210)), 7);
	
	THUMB_WIDTH = width / count;
	THUMB_HEIGHT = THUMB_WIDTH * 297 / 210;
	$("#works-images").height(THUMB_HEIGHT);
	$("#uploads-images").height(THUMB_HEIGHT);
});

function viewWork(cfg) {
	var xhr = callRemoteFunction("config", "draw", { uid: cfg, width: THUMB_WIDTH, height: THUMB_HEIGHT }, function(data) {
		var blob = URL.createObjectURL(xhr.response);

		var container = $("<div style='display: inline-block'></div>");
		container.width(THUMB_WIDTH).height(THUMB_HEIGHT);
		
		var lock = $("<div class='lock-window' inline></div>");
		lock.width(THUMB_WIDTH).height(THUMB_HEIGHT);
		var lockImg = $("<img src='/img/loading.png' class='lock-loading'/>");
		lock.append(lockImg);
		container.append(lock);
		
		var img = $("<img src='" + blob + "'/>");
		img.on("load", function() { 
			lock.fadeOut(400, function(){ 
    			lock.remove(); 
        		img.hide();
        		container.append(img);
        		img.fadeIn();
        	}); 
        });
		
		$("#works-images").append(container);
		$("#works-images").outerWidth($("#works-images").width() + THUMB_WIDTH + 10);
	}, "blob"); 
}

function save(login, name, surname) {
	var error = $("#error");
	callRemoteFunction("user", "save", { name: name.$input.val(), surname: surname.$input.val(), login: login.$input.val() }, function(response) {
		if(response.code == RFC_SUCCESS) {
			error.html("Изменение сохранены");
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
	var shadow = $('<div class="sign-shadow"></div>');
	shadow.css("font-size", "75%");
	$(document.body).append(shadow);
	
	var container = $('<div class="sign-container"></div>');
	shadow.append(container);
	var title = $('<div class="sign-title">Удаление</div>');
	container.append(title);
	
	var text = $("<span>Вы уверены, что хотите удалить аккаунт? Отменить это действие будет не возможно</span>");
	container.append(text);
	
	var ok = $("<button class='sign-submit'>Да</button>");
	ok.on("click", function() {
		callRemoteFunction("user", "delete", {}, function(response) {
			console.log(response.code)
		});
	});
	container.append(ok);
	
	var cancel = $("<button class='sign-submit'>Отмена</button>");
	container.append(cancel);
	shadow.on("click", function(event) {
		if(event.target == shadow[0] || event.target == cancel[0] || event.target == ok[0]) {
			shadow.fadeOut(200, function() {
				shadow.remove();
			});
		}
	});
}

function viewUpload(uid) {
	var xhr = callRemoteFunction("user", "upload", { uid: uid, width: THUMB_WIDTH, height: THUMB_HEIGHT }, function(data) {
		var blob = URL.createObjectURL(xhr.response);

		var container = $("<div style='display: inline-block'></div>");
		container.width(THUMB_WIDTH).height(THUMB_HEIGHT);
		
		var lock = $("<div class='lock-window' inline></div>");
		lock.width(THUMB_WIDTH).height(THUMB_HEIGHT);
		var lockImg = $("<img src='/img/loading.png' class='lock-loading'/>");
		lock.append(lockImg);
		container.append(lock);
		
		var img = $("<img src='" + blob + "'/>");
		img.on("load", function() { 
			lock.fadeOut(400, function(){ 
    			lock.remove(); 
        		img.hide();
        		container.append(img);
        		img.fadeIn();
        	}); 
        });
		
		$("#uploads-images").append(container);
		$("#uploads-images").outerWidth($("#uploads-images").width() + THUMB_WIDTH + 10);
	}, "blob"); 
}