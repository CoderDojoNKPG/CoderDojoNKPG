function loadIncludes() {
	//find all elements with attribute cd-include="yes"
	var includeElements = document.evaluate("//*[@cd-include='yes']", document, null, XPathResult.ANY_TYPE, null)
	var includeElement = includeElements.iterateNext();

	while (includeElement) {
		if (includeElement["href"]) {
			loadInclude(includeElement, includeElement["href"])
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
				body = document.importNode(body, true);
				for (var i = 0; i < body.childNodes.length - 1 ; i++) {
					element.parentElement.insertBefore(body.childNodes[i].cloneNode(true), element);
				}
				element.parentElement.removeChild(element);
			}
		}
	};
	http_request.send(null);
}