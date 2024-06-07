$(document).ready(function () {
	/* ---------- change pin form ---------- */
	$("#changeLocalStorage").on("submit", function (e) {
		e.preventDefault(); // prevents the default form submission
		let curr_pin = $("#currPin").val(); // ge the current pin
		let new_pin = $("#changePin").val(); // get the submitted pin

		if (curr_pin == new_pin) {
			$(this)[0].reset(); // clear the form
			// error users cannot have the same pin
			$("#dialog-error-change-pin").dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
			});
		} else {
			// if the current pin is correct
			if (localStorage.getItem(curr_pin) != null) {
				// and the new pin is of the correct length
				if (new_pin.length == 4) {
					// get the current dates and events from the pin, if there is any
					// should return either a string or an un-parsed JSON object
					let dates_and_events = localStorage.getItem(curr_pin);
					// console.log(dates_and_events);

					// remove the old pin
					localStorage.removeItem(curr_pin);

					// save the new pin
					localStorage.setItem(new_pin, dates_and_events);

					$(this)[0].reset(); // clear the form

					// alert the user that the pin has been changed
					$("#dialog-confirm-change-pin").dialog({
						resizable: false,
						height: "auto",
						width: 400,
						modal: true,
					});
				} else {
					$(this)[0].reset(); // clear the form
					// error the pin must be length of 4
					$("#dialog-error-pin-length").dialog({
						resizable: false,
						height: "auto",
						width: 400,
						modal: true,
					});
				}
			} else {
				$(this)[0].reset(); // clear the form
				// error this is not the current pin
				$("#dialog-error-current-pin").dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
				});
			}
		}
	});

	/* ---------- delete all tasks form ---------- */
	$("#deleteAllTasks").on("submit", function (e) {
		e.preventDefault();

		// display second-confirmation dialog
		$("#dialog-confirm-delete-tasks").dialog({
			resizable: false,
			height: "auto",
			width: 400,
			modal: true,
			buttons: {
				"Delete all tasks": function () {
					// get the entered pin
					let curr_pin = $("#delAllTasksPin").val();

					// get the contents of the current pin
					let dates_and_events = localStorage.getItem(curr_pin);
					// console.log(dates_and_events)

					// if the entered pin exists
					if (dates_and_events != null) {
						// clear the contents
						localStorage.setItem(curr_pin, "empty");
						// close the dialog?
						$(this).dialog("close");
					} else {
						$("#delAllTasksPin").val("");
						$("#delAllTasksPin").attr(
							"placeholder",
							"Entered pin is not correct"
						);
					}
				},
				Cancel: function () {
					$(this).dialog("close");
				},
			},
		});
	});

	/* ---------- delete account form ---------- */
	$("#deleteAccount").on("submit", function (e) {
		e.preventDefault();

		// display second-confirmation dialog
		$("#dialog-confirm-delete-account").dialog({
			resizable: false,
			height: "auto",
			width: 400,
			modal: true,
			buttons: {
				"Delete account": function () {
					// get the entered pin
					let curr_pin = $("#delAccountPin").val();

					// get the contents of the current pin
					let dates_and_events = localStorage.getItem(curr_pin);
					// console.log(dates_and_events)

					// if the entered pin exists
					if (dates_and_events != null) {
						// delete the pin
						localStorage.removeItem(curr_pin);

						// close the dialog
						$(this).dialog("close");

						setTimeout(() => {
							// console.log("waiting");
						}, 5000); // wait 5 seconds
						window.location.href = "login.html";
					} else {
						$("#delAccountPin").val("");
						$("#delAccountPin").attr(
							"placeholder",
							"Entered pin is not correct"
						);
					}
				},
				Cancel: function () {
					$(this).dialog("close");
				},
			},
		});
	});
});
