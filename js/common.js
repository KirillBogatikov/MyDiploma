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
	
	$.ajax({
		type: "post",
		url: "/api/rfc.php?" + group,
		data: data,
		async: async,
		dataType: type || "json"
	}).done(listener);
}

callRemoteFunction("tools", "const", { async: false }, function(response) {
	for(var name in response.body) {
		window[name] = response.body[name]; 
	}
});

$(window).on("load", function() {
	
});

$("a[href^=#]").on("click", function(event) {
	$(window).trigger("onanchorclick", [event, this.href.split("#")[1]]);
});
