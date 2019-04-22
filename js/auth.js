/**
 * 
 */
function signin(login, password) {
	var R;
	callRemoteFunction("auth", "signin", {
		login: login,
		password: password,
		async: false
	}, function(response) {
		$(window).trigger("onsignin", [response.code, response.body]);
		if(response.code == RFC_SUCCESS)
			$(window).trigger("onrolechange");
		R = response;
	});
	return R;	
}

function signup(login, password, name, surname) {
	var R;
	callRemoteFunction("auth", "signup", {
		login: login,
		password: password,
		name: name,
		surname: surname,
		async: false
	}, function(response) {
		$(window).trigger("onsignup", [response.code, response.body]);
		if(response.code == RFC_SUCCESS)
			$(window).trigger("onrolechange");
		R = response;
	});
	return R;
}

function signout() {
	callRemoteFunction("auth", "signout", {}, function(response) {
		$(window).trigger("onsignout", [response.code, response.body]);
		if(response.code == RFC_SUCCESS)
			$(window).trigger("onrolechange");
	});
}

function currentRole() {
	var role;
	callRemoteFunction("auth", "role", { async: false }, function(response) {
		role = response.body;
	});
	return role;
}
/*
$(window).bind("onanchorclick", function(event, click, anchor) {
	if(anchor.startsWith("sign")) {
		click.preventDefault();
		switch(anchor) {
			case "signin": signin(prompt("Login"), prompt("Password")); break;
			case "signup": signup(prompt("Login"), prompt("Password"), prompt("Name"), prompt("Surname")); break;
			case "signout": signout(); break;
		}
	}
});*/