$(document).ready(function () {
	/* ---------- saves pin to local storage ---------- */
	$("#setLocalStorage").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value
		// console.log(pin);

		if (pin.length == 4) {
			localStorage.setItem("simplyTasks", pin); // save the pin to local storage
			$(this)[0].reset(); // clear the form
			// $("#pin").attr("placeholder", "Pin has been saved");
			setTimeout(() => {
				// console.log("waiting");
			}, 5000); // wait 5 seconds
			window.location.href = "login.html";
		} else {
			$(this)[0].reset(); // clear the form
			$("#pin").attr("placeholder", "Pin is not 4 digits");
		}
	});
});
