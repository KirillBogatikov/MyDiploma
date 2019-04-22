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
});

callRemoteFunction("config", "list", {}, function(data) {
	console.log(data);
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
	console.log(data);
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

function save() {
	
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