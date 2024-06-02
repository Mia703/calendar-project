$(document).ready(function () {
	/* ---------- gets pin from local storage ---------- */
	$("#getLocalStorage").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value
		// console.log("pin: " + pin);

		// get the pin from local storage
		const returnedPin = localStorage.getItem("simplyTasks");
		// console.log("localStorage: " + returnedPin)

		// if the input is the same as local storage, go to calendar page
		if (returnedPin == pin) {
			// console.log("correct");
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
