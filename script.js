function loadIncludes() {
	//find all elements with attribute cd-include
	var includeElements = document.evaluate("//*[@cd-include]", document, null, XPathResult.ANY_TYPE, null)
	var includeElement = includeElements.iterateNext();

	while (includeElement) {
		if (includeElement.attributes["cd-include"]) {
			loadInclude(includeElement, includeElement.attributes["cd-include"].value)
		}
		includeElement = includeElements.iterateNext();
	}
}


function loadInclude(element, url) {
	var http_request = new XMLHttpRequest();
	http_request.open("GET", url, true);
	http_request.onreadystatechange = function () {
		var done = 4, ok = 200, local = 0;
		if (http_request.readyState == done) {
			if (http_request.status == ok || http_request.status == local) {
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(http_request.responseText, "application/xml");
				var body = xmlDoc.evaluate("/html/body", xmlDoc, null, XPathResult.ANY_TYPE, null).iterateNext();
				element.innerHTML = body.innerHTML;
			}
		}
	};
	http_request.send(null);
}

function updateMenuVisible() {
	var nav = document.getElementById("mainMenu");
	var toggleMenu = document.getElementById("toggleMenu");

	if (toggleMenu.checked) {
		nav.classList.add("visible")
	}
	else {
		nav.classList.remove("visible")
	}
}