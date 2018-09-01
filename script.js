
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

	//start screens
	updateScreens();
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
Screens timing
================
*/

function updateScreens() {
	var allscreens = document.getElementsByClassName("screen");

	if (allscreens.length==0) {
		return;
	}

	var screens = [];
	var phaseTimes = [];
	for (var i = allscreens.length - 1; i >= 0; i--) {
		if (allscreens[i].attributes.hasOwnProperty("from") && allscreens[i].attributes.hasOwnProperty("to")) {
			phaseTimes.push(parseInt(allscreens[i].attributes.from.value));
			phaseTimes.push(parseInt(allscreens[i].attributes.to.value));
			screens.push(allscreens[i])
		}
	}
	phaseTimes = Array.from(new Set(phaseTimes));
	phaseTimes.sort(function(a, b){return a - b});

	var phaseScreens = [];
	for (var i = 0; i < phaseTimes.length - 1; i++) {
		phaseScreens.push([]);
		for (var j = screens.length - 1; j >= 0; j--) {
			if (screens[j].attributes.hasOwnProperty("from") && screens[j].attributes.hasOwnProperty("to")) {
				var from = parseInt(screens[j].attributes.from.value);
				var to = parseInt(screens[j].attributes.to.value);

				if (from <= phaseTimes[i] && to >= phaseTimes[i+1]) {
					phaseScreens[i].push(screens[j]);
				}
			}
		}
	}

	var startDate = new Date(2018,8,1,21,15);
	var currentMinute = (new Date() - startDate)/1000/60;
	var currentPhase = -1;

	for (var i = 0; i < phaseTimes.length-1; i++) {
		if (currentMinute >= phaseTimes[i] && currentMinute <= phaseTimes[i+1]) {
			currentPhase = i;
			break;
		}
	}

	var currentScreen = -1;
	for (var j = 0; j < phaseScreens[currentPhase].length; j++) {
		if (phaseScreens[currentPhase][j].style.display == "block") {
			currentScreen = j;
			break;
		}
	}
	currentScreen = (currentScreen + 1) % phaseScreens[currentPhase].length;

	screens.map(function(screen) {screen.style.display = "none";})
	phaseScreens[currentPhase][currentScreen].style.display = "block";


	if (document.getElementsByClassName("screen").length > 0) {
		setTimeout(updateScreens, 10000);
	}
}



/* 
================
Load event info from Eventbrite
================*/

var timeUnits = {
	second: 1,
	minute: 60,
	hour: 3600,
	day: 86400,
	week: 604800,
	month: 2592000,
	year: 31536000
};

function getNumberOfDaysBetween(date1, date2) {
  var oneDay = 24*60*60*1000;
  return Math.round((date2.getTime() - date1.getTime())/(timeUnits.day)); 
}

function formatDate(date) {
	var dateStr = date.getFullYear() + "-";
		if (date.getMonth()+1 < 10) 
			dateStr += "0";
		dateStr += (date.getMonth()+1) + "-";
		if (date.getDate() < 10)
			dateStr += "0";
		dateStr += date.getDate();
	return dateStr;
}

function getHumanReadableDate(date) {
	var dateStr, amount,
		current = new Date().getTime(),
		diff = (current - date.getTime()) / 1000;

	if(diff > timeUnits.week) {
		dateStr = formatDate(date);
	}
	else if(diff > timeUnits.day) {
		amount = Math.round(diff/timeUnits.day);
		dateStr = ((amount > 1) ? amount + " " + "dagar sedan":"igår");
	} 
	else if(diff > timeUnits.hour) {
		amount = Math.round(diff/timeUnits.hour);
		dateStr = ((amount > 1) ? amount + " " + "timmar":"en timme") + " sedan";
	} 
	else if(diff > timeUnits.minute) {
		amount = Math.round(diff/timeUnits.minute);
		dateStr = ((amount > 1) ? amount + " " + "minuter":"en minut") + " sedan";
	} 
	else if(diff > -timeUnits.minute){
		dateStr = "nu";
	}
	else if(diff > -timeUnits.hour) {
		amount = -Math.round(diff/timeUnits.minute);
		dateStr = "om " + ((amount > 1) ? amount + " " + "minuter":"en minut");
	} 
	else if(diff > -timeUnits.day) {
		amount = -Math.round(diff/timeUnits.hour);
		dateStr = "om " + ((amount > 1) ? amount + " " + "timmar":"en timme");
	} 
	else if(diff > -timeUnits.week) {
		amount = -Math.round(diff/timeUnits.day);
		dateStr = ((amount > 1) ? "om " + amount + " " + "dagar":"imorgon");
	}
	else {
		dateStr = formatDate(date);
	}

	return dateStr;
};


function loadEventInfo() {
	var nextDojoP = document.getElementById("next-dojo")
	nextDojoP.classList.add("invalid"); //hide while loading

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
			else {
				nextDojoInfo.innerHTML = 'Kommande dojos hittar du på <a href="https://www.eventbrite.com/o/coderdojo-norrkoping-6121564077" class="button">Eventbrite</a>';
				nextDojoP.classList.remove("invalid"); 
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
		return 1;
	}
	return 0;
}

function updateEventInfo(eventData) {
	var events = eventData.events.sort(compareEvents);
	var nextDojoInfo = document.getElementById("next-dojo-info");
	var nextDojoP = document.getElementById("next-dojo")

	if (events.length == 0) {
		nextDojoInfo.innerHTML = "Nästa dojo annonseras inom kort </br>";
		nextDojoInfo.innerHTML += '<a href="https://www.eventbrite.com/o/coderdojo-norrkoping-6121564077" class="button">Eventbrite</a>';
	}
	else {
		nextDojoInfo.innerHTML = ""
		for (var i = 0; i < events.length; i++) {
			nextDojoInfo.innerHTML += getEventInfoHTML(events[i]) + "<br/>";
		}
	}
	nextDojoP.classList.remove("invalid"); 
}

function getEventInfoHTML(event) {
	var strHTML = "";
	var eventDate = new Date((Date.parse(event.start.utc)));

	if (event.name.text.startsWith("CoderDojo Norrköping")) {
		//Normal dojo
		strHTML = event.name.text;
		var registrationDate = new Date(eventDate.getTime() - 1000*(4*24+17) * timeUnits.hour); //registration starts wednesday 18:00 before dojo (65 hours before start)
		if (new Date() < registrationDate) {
			//event is not on sale yet
			strHTML += " " + '<a href="' + event.url + '" class="button">Mer info</a>';
			strHTML  += "<br/> <small>Anmälan släpps " + getHumanReadableDate(registrationDate) + "</small>";
		}
		else {
			strHTML += " " + '<a href="' + event.url + '" class="button">Anmälan</a>';
		}
	}
	else {
		//other event
		strHTML = formatDate(eventDate) + ": " + event.name.text;
		var registrationDate = new Date(eventDate.getTime() - 7 * timeUnits.day); //registration starts one week before
		if (new Date() < registrationDate) {
			//event is not on sale yet
			strHTML += " " + '<a href="' + event.url + '" class="button">Mer info</a>';
		}
		else {
			strHTML += " " + '<a href="' + event.url + '" class="button">Anmälan</a>';
		}
	}


	return strHTML;
}

