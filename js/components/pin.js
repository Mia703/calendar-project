$(document).ready(function () {
	// new.html -- saves pin
	$("#newUserPinForm").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value
		// console.log(pin);

		if (pin.length == 4) {
			localStorage.setItem("simplyTasks", pin); // save the pin to local storage
			$(this)[0].reset();
			$("#pin").attr("placeholder", "Pin has been saved");
		} else {
			$(this)[0].reset();
			$("#pin").attr("placeholder", "Pin is not 4 digits");
		}
	});

	// home.html -- gets pin
	$("#pinForm").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value

		// get the pin from local storage
		const returnedPin = localStorage.getItem("simplyTasks");

		// if the input is the same as local storage, go to calendar page
		if (returnedPin == pin) {
			// console.log("correct");
			window.location.href = "./pages/calendar/calendar.html";
		}
		// else, clear form
		else {
			$(this)[0].reset();
			$("#pin").attr("placeholder", "Entered pin is incorrect");
		}
	});
});
