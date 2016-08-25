function updateTimeline() {
	var secTimeline = document.getElementById("timeline");
	var divProgressbar = document.getElementById("dojo-progressbar");
	var divMarker = document.getElementById("dojo-marker");

	var currentDate = new Date(2016,7,27,12,20); //new Date();
	var dojoStartHour = 11; //Dojo starts at 11:00
	var dojoDuration = 2; //Dojo takes 2 hours

	function isDojo(date) {
		if ((date.getDay() == 6) && (date.getHours() >= dojoStartHour && date.getHours() < dojoStartHour + 2)) { //it's saturday between 11-13 :-)
			return true;
		}
		else {
			return false;
		}
	}

	if (isDojo(currentDate)) {
		secTimeline.classList.remove("invisible");

		var currentSeconds = 60*60*60*currentDate.getHours() + 60*60*currentDate.getMinutes() + currentDate.getSeconds();
		var dojoStartSeconds = 60*60*60*dojoStartHour;
		var progress = (currentSeconds - dojoStartSeconds)/(60*60*60*dojoDuration);

		divProgressbar.style.width = (100*progress).toString() + "%";
		divMarker.style.left = (100*progress-1).toString() + "%";

		setTimeout("updateTimeline()", 5000);
	}
	else {
		secTimeline.classList.add("invisible");
		setTimeout("updateTimeline()", 60000);
	}
}