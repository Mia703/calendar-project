$(document).ready(function () {
	/* ---------- saves pin to local storage ---------- */
	$("#setLocalStorage").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission
		let pin = $("#pin").val(); // get the value
		// console.log(pin);

		if (pin.length == 4) {
			localStorage.setItem(pin, "empty"); // save the pin to local storage
			$(this)[0].reset(); // clear the form
			
			// success dialog appears, redirects to login page after closing
			$("#dialog-confirm-set-pin").dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				buttons: {
					"Close": function () {
						$(this).dialog("close");
							setTimeout(() => {
								// console.log("waiting");
							}, 5000); // wait 5 seconds
							window.location.href = "login.html";
					},
				},
			});

		} else {
			$(this)[0].reset(); // clear the form
			$("#pin").attr("placeholder", "Pin is not 4 digits");
		}
	});
});
