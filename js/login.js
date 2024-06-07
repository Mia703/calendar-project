$(document).ready(function () {
	/* ---------- gets pin from local storage ---------- */
	$("#getLocalStorage").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value
		// console.log("pin: " + pin);
		// make the current user's pin global

		// get the pin from local storage
		const returnedPin = localStorage.getItem(pin);
		// console.log("localStorage: " + returnedPin)

		// if the input is the same as local storage, go to calendar page
		// if the pin doesn't exist it will return null
		// else return "empty" or or date and event objects
		if (returnedPin != null) {
			// console.log("correct");

			// saves the current user's pin - for getting tasks
			localStorage.setItem("simplyTasks", pin);

			setTimeout(() => {
				// console.log("waiting");
			}, 5000); // wait 5 seconds
			window.location.href = "calendar.html";
		}
		// else, clear form
		else {
			$(this)[0].reset();
			$("#pin").attr("placeholder", "Entered pin is incorrect");
		}
	});
});
