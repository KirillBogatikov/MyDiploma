/**
 * 
 */

var TYPE_DIVS = {};
var CURRENT_TYPE_DIV;

__LOADING = new ModalWindow();
__LOADING.show();

var L = 0;

$(window).on("load", function() {
	callRemoteFunction("types", "list", {}, function(response) {
		for(var i in response.body) {
			var type = response.body[i];
			TYPE_DIVS[type.id] = $("<div id='" + type.id + "' class='type-block'></div>");
		}
	});
	
	loadUsers();
	loadSegments();
	
	var check = function() {
		if(L > 0) {
			setTimeout(check, 500);
		} else {
			__LOADING.hide();
		}
	};
	check();
});

function deleteSegment() {
	var type = CURRENT_TYPE_DIV.attr("id");
	var uid = $("#delete").attr("target");
	
	callRemoteFunction("segments", "remove", { type: type, uid: uid }, function() {
		$("#" + uid).remove();
	});
};

function uploadSegment() {
	var input = $("<input type='file' accept='image/*'/>");
	input.click();
	input.on("change", function() {
		var data = new FormData();
		data.append("image", input[0].files[0]);
		
		$.ajax({
			type: "POST",
			url: "/api/rfc.php?segments&upload&type=" + CURRENT_TYPE_DIV.attr("id"),
			processData: false,
			contentType: false,
			data: data
		}).done(function(d) {
			var mw = new ModalWindow($("<div class='refresh-window'>Файл успешно загружен. Через 5 секунд страница будет перезагружена</div>"));
			mw.show();
			setTimeout(function() {
				document.location.href += " ";
			}, 5000);
		});
	});
}

function showType(id) {
	CURRENT_TYPE_DIV = TYPE_DIVS[id];
	$("#types").append(CURRENT_TYPE_DIV);
	CURRENT_TYPE_DIV.fadeIn();
}

function loadSegments() {
	$("#segments .tool").outerHeight($("#type").outerHeight());
	$("#type").outerWidth($("#controls").width() - $("#segments .tool").outerHeight() * 2 - 20);
	$("#controls").outerHeight($("#type").outerHeight());
	$("#delete").fadeOut();
	$("#upload").fadeOut();
	
	callRemoteFunction("types", "list", {}, function(response) {
		var types = response.body;
		for(var i in types) {
			$("#type").append($("<option value='" + types[i].id + "'>" + types[i].name + "</option>"));
			$("#type").on("change", function() {
				var id = $("#type").val();
				$("#upload").fadeIn();
				if(CURRENT_TYPE_DIV) {
					CURRENT_TYPE_DIV.fadeOut(200, function() {
						CURRENT_TYPE_DIV.remove();
						showType(id);
					});
				} else {
					showType(id);
				}
			});
			
			var div = $("<div class='segment-list' id='" + types[i].id + "'></div>");
			$("#types").append(div);
			
			var width = $("#types").width();
			var count = Math.ceil(Math.max(Math.min(width / 105, 7), 3)); 
			console.log(count);
			width = width / count;
			
			if(types[i].type.indexOf("editable") == -1) {
				(function(type, div) {
					callRemoteFunction("segments", "list", { type: type.id, offset: 0 }, function(response) {
						var segments = response.body;
						for(var i in segments) {
							(function(i){
								var xhr = callRemoteFunction("segments", "load", { type: type.id, uid: segments[i], width: width }, function(d) {
									console.log(xhr.response);
									var blob = URL.createObjectURL(xhr.response);
									var img = $("<img id='" + segments[i] + "' class='segment-item' src='" + blob + "'/>");
									img[0].onclick = function() {
										img.animate({ opacity: 0.5 }, 200);
										$("#delete").fadeIn().attr("target", segments[i]);
									};
									div.append(img);
									img.outerWidth(width - 20);
								}, "blob");
							})(i);
						}
					});
				})(types[i], div);
			}
			
			TYPE_DIVS[types[i].id] = div;
			div.hide().remove();
		}

		showType($("#type").val());
	});
}

function loadUsers() {
	callRemoteFunction("user", "list", {}, function(response) {
		var users = response.body;
		
		for(var i in users) {
			var row = $("<tr></tr>");
			row.append($("<td class='cell'>" + users[i].id + "</td>"));
			row.append($("<td class='cell'>" + users[i].login + "</td>"));
			row.append($("<td class='cell'>" + users[i].surname + " " + users[i].name + "</td>"));
			var cfgs = $("<td class='cell'></td>");
			row.append(cfgs);
			var upls = $("<td class='cell'></td>");
			row.append(upls);
			$("#users").append(row);
			
			L+=2;
			
			(function(row, id) {
				callRemoteFunction("user", "configs", { id:id }, function(response) {
					row.html(response.body.length);
					L--;
				});
			})(cfgs, users[i].id);
			(function(row, id) {
				callRemoteFunction("user", "uploads", { id:id }, function(response) {
					row.html(response.body.length + "</td>");
					L--;
				});
			})(upls, users[i].id);
			
			var ctrl = $("<td></td>");
			row.append(ctrl);
			
			if(users[i].id != currentID()) {
				var del = $("<img src='/img/tools/delete.png' class='tool'/>");
				ctrl.append(del);
				(function(row, id) {
					del.on("click", function() {
						callRemoteFunction("user", "delete", { id:id }, function() {
							row.remove();
						});
					});
				})(row, users[i].id);
				ctrl.append(del);
				var admin = $("<img class='tool'/>");
				if(users[i].role == "admin") {
					admin.attr("src", '/img/no_admin.png');
				} else {
					admin.attr("src", '/img/admin.png');
				}
				(function(ctr, user) {
					ctr.on("click", function() {
						callRemoteFunction("user", "make_admin", { id: user.id, admin: (user.role == "user") }, function(d) {
							if(user.role == "user") {
								user.role = "admin";
								ctr.attr("src", '/img/no_admin.png');
							} else {
								user.role = "user";
								ctr.attr("src", '/img/admin.png');
							}
						}, "text");
					});
				})(admin, users[i]);
				ctrl.append(admin);
			} else {
				ctrl.html("Вы");
			}
		}
		
		$("#users .tool").outerHeight($("#users td").outerHeight());
	});
}