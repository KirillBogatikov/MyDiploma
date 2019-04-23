/**
 * 
 */

var TYPE_DIVS = {};

__LOADING = new ModalWindow();
__LOADING.show();

$(window).on("load", function() {
	callRemoteFunction("types", "list", {}, function(response) {
		for(var i in response.body) {
			var type = response.body[i];
			TYPE_DIVS[type.id] = $("<div id='" + type.id + "' class='type-block'></div>");
		}
	});
	
	loadUsers();
	
	
});

var L = 0;

function loadUsers() {
	callRemoteFunction("user", "list", {}, function(response) {
		console.log(response);
		var users = response.body;
		
		for(var i in users) {
			var row = $("<tr></tr>");
			row.append($("<td>" + users[i].id + "</td>"));
			row.append($("<td>" + users[i].login + "</td>"));
			row.append($("<td>" + users[i].surname + " " + users[i].name + "</td>"));
			var cfgs = $("<td></td>");
			row.append(cfgs);
			var upls = $("<td></td>");
			row.append(upls);
			$("#users").append(row);
			
			L+=2;
			
			(function(row, id) {
				callRemoteFunction("user", "configs", { id:id }, function(response) {
					console.log(response);
					row.html(response.body.length);
					L--;
				});
			})(cfgs, users[i].id);
			(function(row, id) {
				callRemoteFunction("user", "uploads", { id:id }, function(response) {
					console.log(response);
					row.html(response.body.length + "</td>");
					L--;
				});
			})(upls, users[i].id);
		}
		
		var check = function() {
			if(L > 0) {
				setTimeout(check, 500);
			} else {
				__LOADING.hide();
			}
		};
		check();
	});
}