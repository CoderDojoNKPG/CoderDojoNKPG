
/* 
================
Load includes 
================*/

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

	//include leaflet library for map
	includeMap()
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
				updateLinkActive(element);

				//execute onloads in include HTML
				var elementsWithOnloads = xmlDoc.evaluate("/html/body//*[@onload]", xmlDoc, null, XPathResult.ANY_TYPE, null)
				var elementWithOnload = elementsWithOnloads.iterateNext();
				while (elementWithOnload) {
					if (elementWithOnload.attributes["onload"]) {
						eval(elementWithOnload.attributes["onload"].value)
					}
					elementWithOnload = elementsWithOnloads.iterateNext();
				}
			}
		}
	};
	http_request.send(null);
}

function updateLinkActive(element) {
	var links = document.evaluate(".//a[@href]", element, null, XPathResult.ANY_TYPE, null)
	var activeLinks = [];
	var link = links.iterateNext();

	while (link) {
		if (window.location.href == link.href) {
			activeLinks.push(link); 
		}
		link = links.iterateNext();
	}

	for (var i = 0; i < activeLinks.length; i++) {
		activeLinks[i].classList.add("active");
	}
}

/* 
================
Load map
================*/


function includeMap() {
	//include leaflet css
	var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.1.0/dist/leaflet.css';
    //link.integrity = "sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw==";
    link.crossorigin="anonymous";
    document.head.appendChild(link);

    //include leaflet JS
    var script = document.createElement('script');
    script.addEventListener("load", loadMap);
    script.src = "https://unpkg.com/leaflet@1.1.0/dist/leaflet.js";
    //script.integrity = "sha512-mNqn2Wg7tSToJhvHcqfzLMU6J4mkOImSPTxVZAdo+lcPlk+GhZmYgACEe0x35K7YzW1zJ7XyJV/TT1MrdXvMcA==";
    script.crossorigin = "anonymous";
    document.head.appendChild(script);
}

function loadMap() {
	if (typeof L == 'undefined') { //leaflet not yet initialized
		return;
	}

	var mymap = L.map('map').setView([58.5889, 16.1807], 14);
	L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYml0c3RlbGxlciIsImEiOiJjajU2c292NWQxNTZmMzNzMzZtYWs0Y3JxIn0.G92r5EM3SjfIYKCogbKpNQ"
			 ).addTo(mymap);
	var marker = L.marker([58.5889, 16.1807]).addTo(mymap);
}



/* 
================
Hamburger menu for small screens
================*/

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


/* 
================
Load event info from Eventbrite
================*/

function loadEventInfo() {
	var http_request = new XMLHttpRequest();
	//organizer.id=6121564077 is the user id of CoderDojo Norrköpings profile, token is for another fake profile in order to not expose private data from CoderDojos account
	http_request.open("GET", "https://www.eventbriteapi.com/v3/events/search/?token=EO5BKRJY6BKX2UQ5TUUW&organizer.id=6121564077&include_unavailable_events=on", true);
	http_request.onreadystatechange = function () {
		var done = 4, ok = 200, local = 0;
		if (http_request.readyState == done) {
			if (http_request.status == ok || http_request.status == local) {
				var eventData = JSON.parse(http_request.responseText)
				updateEventInfo(eventData);
			}
		}
	};
	http_request.send(null);
}

function compareEvents(event1, event2) {
	//compare two events by start date
	if (Date.parse(event1.start.utc) < Date.parse(event2.start.utc)) {
		return -1;
	}
	if (Date.parse(event1.start.utc) > Date.parse(event2.start.utc)) {
		return -1;
	}
	return 0;
}

function updateEventInfo(eventData) {
	var events = eventData.events.sort(compareEvents);
	var nextDojoInfo = document.getElementById("next-dojo-info");

	if (events.length == 0) {
		nextDojoInfo.innerHTML = "Nästa dojo anonseras inom kort"
	}
	else {
		var nextDojoEvent = events[0];
		nextDojoInfo.innerHTML = "Nästa dojo: " + events[0].name.text;
		updateRegistrationInfo(nextDojoEvent);
	}
}

function updateRegistrationInfo(nextDojoEvent) {
	var http_request = new XMLHttpRequest();
	//organizer.id=6121564077 is the user id of CoderDojo Norrköpings profile, token is for another fake profile in order to not expose private data from CoderDojos account
	http_request.open("GET", "https://www.eventbriteapi.com/v3/events/search/?token=EO5BKRJY6BKX2UQ5TUUW&organizer.id=6121564077", true);
	http_request.onreadystatechange = function () {
		var done = 4, ok = 200, local = 0;
		if (http_request.readyState == done) {
			if (http_request.status == ok || http_request.status == local) {
				var eventData = JSON.parse(http_request.responseText)
				var events = eventData.events;
				var nextDojoInfo = document.getElementById("next-dojo-info");
				for (var i = 0; i < events.length; i++) {
					if (events[i].id == nextDojoEvent.id) {
						nextDojoInfo.innerHTML += " " + '<a href="' + nextDojoEvent.url + '" class="button">Anmälan</a>';
						return;
					}
				}
				//event is not on sale yet
				nextDojoInfo.innerHTML += " " + '<a href="' + nextDojoEvent.url + '" class="button">Mer info</a>';
				nextDojoInfo.innerHTML += "<br/> <small>Anmälan släpps på kvällen onsdagen innan dojon</small>"
			}
		}
	};
	http_request.send(null);
}


