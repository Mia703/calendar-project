/* ---------- global variables ---------- */
let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let day = today.getDate();

// get the current user's pin
const current_user = localStorage.getItem("simplyTasks");

$(document).ready(function () {
	/* =================== OTHER METHODS =================== */
	/* ---------- start tooltip on desktop ---------- */
	// if the window is the size of a desktop or larger
	// start the tooltip
	if ($(window).width() >= 1025.008) {
		$(document).tooltip();
	}

	$(window).resize(function () {
		// remove any existing tooltips
		if ($(document).tooltip("instance")) {
			$(document).tooltip("destroy");
		}
		// re-add tooltip
		if ($(window).width() >= 1025.008) {
			$(document).tooltip();
		}
	});

	/* =================== CALENDAR METHODS =================== */
	/* ---------- updating calendar month header ---------- */
	const monthsList = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	/**
	 *
	 * @param {number} month the selected month as a number
	 * @param {number} year the selected year as a number
	 * @returns returns the calendar header
	 */
	function getCurrentMonth(month, year) {
		return monthsList[month] + " " + year;
	}

	$("#currMonth").text(getCurrentMonth(parseInt(month), parseInt(year)));

	/* ---------- updating calendar ---------- */

	/**
	 *
	 * @param {number} lastDay
	 * @param {number} currMonth
	 * @param {number} currYear
	 * @returns adds the number of days for the current month
	 */
	function addCurrentMonth_Days(lastDay, currMonth, currYear) {
		let text = "";

		for (let i = 1; i <= lastDay; i++) {
			// if current date, add "today" class name
			if (i == today.getDate() && currMonth == month && currYear == year) {
				// if the current date has a events, add 'event' class name
				if (hasEvents(currYear, currMonth, i)) {
					text += `<div class="day today event">${i}</div>`;
				} else {
					text += `<div class="day today">${i}</div>`;
				}
			} else {
				// if other dates have events, add 'event' class name
				if (hasEvents(currYear, currMonth, i)) {
					text += `<div class="day event">${i}</div>`;
				} else {
					text += `<div class="day">${i}</div>`;
				}
			}
		}
		return text;
	}

	/**
	 *
	 * @param {number} weekday corresponds to Saturday (0) through Sunday (6)
	 * @param {number} calendarNumber the last day of the previous month, as a number
	 * @returns adds the last few days of the previous month
	 */
	function addPrevMonth_Days(weekday, calendarNumber) {
		let text = "";
		for (let i = weekday; i > 0; i--) {
			text += `<div class="day prev-day">${calendarNumber - i + 1}</div>`;
		}
		return text;
	}

	/**
	 *
	 * @param {number} daysLeft the number of days left to fill the calendar grid
	 * @returns adds the last few days of the next month
	 */
	function addNextMonth_Days(daysLeft) {
		let text = "";
		for (let i = 1; i <= daysLeft; i++) {
			text += `<div class="day next-day">${i}</div>`;
		}
		return text;
	}

	/**
	 *
	 * @param {number} month the selected month
	 * @param {number} year the selected year
	 * @returns displays the calendar
	 */
	function getCalendar(month, year) {
		// ------------- current month -------------
		// returns the first day of the current month, as a date
		const firstDayOf_currMonth = new Date(year, month, 1);

		// returns the last day of the current month, as a date
		const lastDayOf_currMonth = new Date(year, month + 1, 0);

		// returns the last day of the current month, as a number
		const lastDayOf_currMonth_Number = lastDayOf_currMonth.getDate();

		// ------------- previous month -------------
		// returns the last day of the previous month, as a date
		const lastDayOf_preMonth = new Date(year, month, 0);

		// returns the last day of the previous month, as a number
		const lastDayOf_prevMonth_Number = lastDayOf_preMonth.getDate();

		// ------------- adding days to string -------------
		let day = "";

		// adds the last few days of the previous month
		day += addPrevMonth_Days(
			firstDayOf_currMonth.getDay(),
			lastDayOf_prevMonth_Number
		);

		// adds the current month's days (1 to 30/31)
		day += addCurrentMonth_Days(lastDayOf_currMonth_Number, month, year);

		// calculate the number of days left to fill the calendar
		// the calendar is a 7x6  grid = 42 squares to fill the calendar
		// 30 to 31 days of the current month +
		// the number of squares left from first day of the current month
		let daysLeft =
			42 - (firstDayOf_currMonth.getDay() + lastDayOf_currMonth_Number);

		// adds the next few days of the following month
		day += addNextMonth_Days(daysLeft);

		return day;
	}

	/* displays the calendar for the current month */
	let currentContent = $("#days").html();
	$("#days").html(currentContent + getCalendar(month, year));

	/* ---------- selecting a day on the calendar ---------- */
	// updates clicked "day" element with "active" styling
	// returns clicked day's events for tasks list
	$(document).on("click", ".day:not(.prev-day, .next-day)", function () {
		// add the "active" class to the clicked element
		$(".day.active").removeClass("active");
		$(this).addClass("active");

		// update the header
		let clickedDate = new Date(year, month, $(this).html());
		$("#dayOfWeek").text(getDayOfWeek(clickedDate.getDay()));
		$("#fullDate").text(getFullDate(clickedDate.getDate(), month, year));

		// get events from local storage and display them
		// else display "No tasks today!"
		$(".tasks").html(
			hasEvents(year, month, $(this).text())
				? getEvents(year, month, $(this).text())
				: `<p>No tasks today!</p>`
		);
	});

	/* ---------- updating calendar previous and next buttons ---------- */
	let monthIndex = month; // get the current month (global)
	let yearIndex = year; // get the current year (global)

	// on click of the previous button
	$("button.left.prev").on("click", function () {
		monthIndex = month;
		yearIndex = year;

		monthIndex -= 1; // move the index

		// if the index is less than 0
		// set the month to 11, and decrease the year
		if (monthIndex == -1) {
			monthIndex = 11;
			yearIndex -= 1;
			yearIndex = yearIndex;
		}
		monthIndex = monthIndex; // save the new index

		// update month and year (global)
		month = monthIndex;
		year = yearIndex;

		// console.log("moving prev:" + monthIndex + "/" + yearIndex);

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar (currentContent (global))
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

	// on click of the next button
	$("button.right.next").on("click", function () {
		monthIndex = month;
		yearIndex = year;

		monthIndex += 1; // move the index

		// if the index equals 12
		// set the month to 0 and increase the year
		if (monthIndex == 12) {
			monthIndex = 0;
			yearIndex += 1;
			yearIndex = yearIndex;
		}
		monthIndex = monthIndex; // save the new index

		// update month and year (global)
		month = monthIndex;
		year = yearIndex;

		// console.log('moving next:' + monthIndex + "/" + yearIndex);

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

	/* ---------- go specific date ---------- */
	$("#getDate").on("submit", function (e) {
		e.preventDefault(); // prevent the default form submission

		/* ---------- get selected date ---------- */
		let selected_date = new Date($("#goToDate").val());
		// console.log(selected_date);

		let selected_day = selected_date.getDate() + 1;
		let selected_month = selected_date.getMonth();
		let selected_year = selected_date.getFullYear();

		/* ---------- update global month and year ---------- */
		month = selected_month;
		year = selected_year;
		// console.log("go to: " + month + "/" + year);

		/* ---------- update month header and calendar ---------- */
		// update month header
		$("#currMonth").text(getCurrentMonth(selected_month, selected_year));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(selected_month, selected_year)
		);

		/* ---------- update tasks header and list ---------- */
		// update the tasks header
		$("#dayOfWeek").text(getDayOfWeek(selected_day));
		$("#fullDate").text(
			getFullDate(selected_day, selected_month, selected_year)
		);

		// update tasks list
		// get events from local storage and display them
		// else display "No tasks today!"
		$(".tasks").html(
			hasEvents(selected_year, selected_month, selected_day)
				? getEvents(selected_year, selected_month, selected_day)
				: `<p>No tasks today!</p>`
		);

		/* ---------- remove "active" tag from previous ---------- */
		// remove the "active" tag from the previously selected date
		$(".day.active").removeClass("active");

		/* ---------- add "active" tag to selected ---------- */
		// add "active" tag to selected date
		// finds all elements with the selected number
		$(`.day:not(.prev-day, .next-day):contains(${selected_day})`)
			// filters out that selection to return only the specified day
			.filter(function () {
				return $(this).text().trim() === `${selected_day}`;
			})
			// adds the "active" class name
			.addClass("active");
	});

	/* ---------- today button ---------- */
	$("#todayButton").on("click", function () {
		/* ---------- get today's date ---------- */
		let today = new Date();
		let today_month = today.getMonth();
		let today_year = today.getFullYear();
		let today_day = today.getDate();

		/* ---------- update global month and year ---------- */
		month = today_month;
		year = today_year;
		day = today_day;

		/* ---------- update month header and calendar ---------- */
		// update the month header
		$("#currMonth").text(getCurrentMonth(month, year));
		// update the calendar
		$(".container.days").html(currentContent + getCalendar(month, year));

		/* ---------- update tasks header and list ---------- */
		// update  tasks header
		$("#dayOfWeek").text(getDayOfWeek(day));
		$("#fullDate").text(getFullDate(day, month, year));

		// update tasks list
		// get events from local storage and display them
		// else display "No tasks today!"
		$(".tasks").html(
			hasEvents(year, month, day)
				? getEvents(year, month, day)
				: `<p>No tasks today!</p>`
		);

		/* ---------- remove "active" tag from previous ---------- */
		// remove the "active" tag from the previously selected date
		$(".day.active").removeClass("active");

		/* ---------- add "active" tag to selected ---------- */
		// add the "active" tag to today's date
		$(".day.today").addClass("active");
	});

	/* =================== TASKS & TASK LIST METHODS =================== */
	/* ---------- updating tasks header ---------- */
	const dayOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	/**
	 *
	 * @param {number} index the day of the week as a number, Sunday (0) through Saturday (6)
	 * @returns the selected day's day of week
	 */
	function getDayOfWeek(index) {
		return dayOfWeek[index];
	}

	$("#dayOfWeek").text(getDayOfWeek(today.getDay()));

	/**
	 *
	 * @param {number} day the selected day
	 * @param {number} month the selected month
	 * @param {number} year the selected year
	 * @returns the full date for task list header
	 */
	function getFullDate(day, month, year) {
		return monthsList[month] + " " + day + ", " + year;
	}

	$("#fullDate").text(getFullDate(today.getDate(), month, year));

	/* ---------- default tasks container display ---------- */
	// if the current day has tasks, display them
	$(".tasks").html(
		hasEvents(year, month, day)
			? getEvents(year, month, day)
			: `<p>No tasks today!</p>`
	);

	/* ---------- adding a task ---------- */
	// on click of add task button, display new task dialog form
	$("#addTaskButton").on("click", function () {
		$("#newTaskForm").trigger("reset"); // reset the form values (just in case there's still values there)
		$("#newTaskDialog").dialog({
			height: "auto",
			width: 400,
			modal: true,
		}); // open the form
	});

	$("#newTaskForm").on("submit", function (e) {
		e.preventDefault(); // prevent the default submission

		// get form inputs
		let title = $("input#title").val();
		let description = $("textarea#description").val();
		let startTime = $("input#startTime").val(); // military time - 09:00
		let endTime = $("input#endTime").val(); // military time
		let priority = $("select#priority").val();

		// add the 'event' tag to the currently selected day
		if ($(".day").hasClass("active")) {
			$(".day.active").addClass("event");
		} else {
			$(".day.today").addClass("event");
		}

		// create the task and add to tasks container
		const currentTasks = $(".tasks").html(); // what's currently in the task list

		// if "No tasks today!" is present, remove upon creation of first task
		if (currentTasks == "<p>No tasks today!</p>") {
			$(".tasks").html(
				createTask(title, description, startTime, endTime, priority)
			);
		}
		// else, continue to add to tasks list
		else {
			$(".tasks").html(
				currentTasks +
					createTask(title, description, startTime, endTime, priority)
			);
		}

		// save the task to localhost
		let day = $(".day.active").text()
			? $(".day.active").text()
			: $(".day.today").text();

		saveEvent(
			year,
			month,
			day,
			title,
			description,
			startTime,
			endTime,
			priority
		);

		$("#newTaskForm").trigger("reset"); // reset the form values
		$("#newTaskDialog").dialog("close"); // close the form
	});

	/* ---------- removing a task ---------- */
	// on click of task trash button, remove task
	$(document).on("click", "button.trash", function () {
		// create the date object
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(
				$(".day.active").text()
					? $(".day.active").text()
					: $(".day.today").text()
			),
		};

		// console.log(date);

		// split the string "9:00 AM - 12:00 PM"
		// into "9:00 AM" and "12:00 PM"
		let [startTime, endTime] = $(this)
			.closest(".task")
			.find(".time")
			.text()
			.split(" - ");

		// determine the priority
		let priority = "";
		if ($(this).closest(".task").hasClass("low")) {
			priority = "low";
		} else if ($(this).closest(".task").hasClass("medium")) {
			priority = "medium";
		} else if ($(this).closest(".task").hasClass("high")) {
			priority = "high";
		}

		// create the event object
		let event = {
			title: $(this).closest(".task").find(".title").text(),
			desc: $(this).closest(".task").find(".description").text(),
			start: formatToMilitaryTime(startTime),
			end: formatToMilitaryTime(endTime),
			priority: priority,
		};

		// console.log(event);

		// remove the task from local storage
		let confirmation = removeEvent(date, event);

		// if there are no more events for the specified day
		// remove the 'event' tag
		if (confirmation == 0) {
			// remove the event tag
			if ($(".day").hasClass("active")) {
				$(".day.active").removeClass("event");
			} else {
				$(".day.today").removeClass("event");
			}
		}

		// remove the task from tasks list view
		$(this).closest(".task").remove();
	});

	/**
	 *
	 * @param {string} title the name of the task
	 * @param {string} description
	 * @param {string} startTime
	 * @param {string} endTime
	 * @param {string} priority
	 * @returns creates a task HTML string
	 */
	function createTask(title, description, startTime, endTime, priority) {
		let task = `<div class="task ${priority} ${colourPriority(priority)}">
					<div class="content container">
						<div>
							<p class="title">${title}</p>
							<p class="time">
								${formatTime(String(startTime))} - ${formatTime(String(endTime))}
							</p>
						</div>
						<p class="description">${description}</p>
					</div>
					<div class="trash container">
						<button type="button" class="trash">
							<span class="material-symbols-outlined">
								delete
							</span>
						</button>
					</div>
				</div>`;
		return task;
	}

	/**
	 *
	 * @param {string} time the time to convert
	 * @returns formats the time as HH:mm AM ? PM
	 */
	function formatTime(time) {
		const timeArray = time.split(":"); // split the time into ["09", "00"] or ["21", "00"]

		let hour = timeArray[0];

		// if the hour has a leading 0, remove it
		if (timeArray[0].charAt(0) == "0") {
			hour = timeArray[0].charAt(1);
		}

		// determine if it's AM or PM
		let period = hour >= 12 ? "PM" : "AM";

		// change the hour if its military time
		hour = hour % 12 || 12;

		// return the reformatted time
		return hour + ":" + timeArray[1] + " " + period;
	}

	/**
	 *
	 * @param {string} time
	 * @returns formats HH:mm AM ? PM to military time
	 */
	function formatToMilitaryTime(time) {
		let [hour, minute] = time.split(":");

		hour = parseInt(hour);
		minute = parseInt(minute);

		// check if time is 'PM' and not noon
		if (time.includes("PM") && hour !== 12) {
			hour += 12;
		} else if (time.includes("AM") && hour == 12) {
			hour += 0;
		}

		let formattedMinute = minute < 10 ? "0" + minute : minute;

		// return in military format
		return `${hour < 10 ? "0" + hour : hour}:${formattedMinute}`;
	}

	/**
	 *
	 * @param {string} priority
	 * @returns returns the colour the priority should be
	 */
	function colourPriority(priority) {
		if (priority == "low") {
			return "yellow";
		} else if (priority == "medium") {
			return "green";
		} else {
			return "red";
		}
	}

	/* =================== LOCAL STORAGE METHODS =================== */
	/**
	 *
	 * @param {string} year
	 * @param {string} month
	 * @param {string} day
	 * @param {string} title
	 * @param {string} description
	 * @param {string} startTime
	 * @param {string} endTime
	 * @param {string} priority
	 *
	 * saves task to localhost
	 */
	function saveEvent(
		year,
		month,
		day,
		title,
		description,
		startTime,
		endTime,
		priority
	) {
		// create a date object
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(day),
		};

		// create the event object
		let event = {
			title: title,
			desc: description,
			start: startTime,
			end: endTime,
			priority: priority,
		};

		// console.log(current_user); // global
		// console.log(date);
		// console.log(event);

		// if the date is not already saved in local storage, save it
		if (localStorage.getItem(current_user) == "empty") {
			// create the eventsList object
			let eventsList = {};

			// turn the date into a string
			let date_string = JSON.stringify(date);

			// save the event
			eventsList[date_string] = [event];

			// save to local storage
			localStorage.setItem(current_user, JSON.stringify(eventsList));
		}
		// else, get the saved data and update it
		else {
			// get the users's eventsList
			let eventsList = JSON.parse(localStorage.getItem(current_user));
			// console.log(eventsList);

			// turn the date into a string
			let date_string = JSON.stringify(date);

			// if the selected date is already saved
			if (eventsList[date_string]) {
				// add the new event to the array
				eventsList[date_string].push(event);

				// save to local storage
				localStorage.setItem(current_user, JSON.stringify(eventsList));
			}
			// else the date is not saved
			else {
				// add the event to a new section of the array
				eventsList[date_string] = [event];

				// save to local storage
				localStorage.setItem(current_user, JSON.stringify(eventsList));
			}
		}
	}

	/**
	 *
	 * @param {string} year
	 * @param {string} month
	 * @param {string} day
	 * @returns list of tasks for specific day
	 */
	function getEvents(year, month, day) {
		// create a date object
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(day),
		};

		// convert the date ito a string
		let date_string = JSON.stringify(date);

		// get the user's events list
		let eventsList = JSON.parse(localStorage.getItem(current_user));

		// if there are events at the specified date
		if (eventsList[date_string]) {
			// return the events string
			let events_string = "";

			for (let i = 0; i < eventsList[date_string].length; i++) {
				events_string += createTask(
					eventsList[date_string][i].title,
					eventsList[date_string][i].desc,
					eventsList[date_string][i].start,
					eventsList[date_string][i].end,
					eventsList[date_string][i].priority
				);
			}

			return events_string;
		}
		// else, there are no events at the specified date
		else {
			return "";
		}
	}

	/**
	 *
	 * @param {string} year
	 * @param {string} month
	 * @param {string} day
	 * @returns returns true if specific day has events
	 */
	function hasEvents(year, month, day) {
		// if the current user's eventsList is empty
		if (localStorage.getItem(current_user) == "empty") {
			return false;
		}
		// else, the current user has events somewhere in the calendar
		else {
			// if the selected date has events, return true
			if (getEvents(year, month, day) != "") {
				return true;
			}
			return false;
		}
	}

	/**
	 *
	 * @param {object} date
	 * @param {object} event
	 * @returns removes task from local storage, returns 0 if all tasks are gone, else 1
	 */
	function removeEvent(date, event) {
		// if the customer has events somewhere
		if (localStorage.getItem(current_user) != "empty") {
			// convert the date to string
			let date_string = JSON.stringify(date);

			// get the current user's events list
			let eventsList = JSON.parse(localStorage.getItem(current_user));

			// if the selected day only has one event
			if (eventsList[date_string].length == 1) {
				// remove the specified date property
				delete eventsList[date_string];

				// update local storage
				localStorage.setItem(current_user, JSON.stringify(eventsList));

				// if the user's events list object is now empty
				// replace with "empty"
				if (isEventsListEmpty()) {
					localStorage.setItem(current_user, "empty");
				}

				return 0;
			}
			// else, the selected day has more than one event
			else {
				// iterate over the events list to find the specified event
				// iterates using the Arrays.forEach() method
				eventsList[date_string].forEach(updateArray);

				// removes the event at the specified index.
				function updateArray(item, index) {
					if (JSON.stringify(event) == JSON.stringify(item)) {
						console.log(index);
						eventsList[date_string].splice(index, 1); // remove the event from the array
						return; // exit the loop
					}
				}

				// update local storage
				localStorage.setItem(current_user, JSON.stringify(eventsList));

				// if the user's events list object is now empty
				// replace with "empty"
				if (isEventsListEmpty()) {
					localStorage.setItem(current_user, "empty");
				}

				return 1;
			}
		}
	}

	/**
	 *
	 * @returns checks if the user's eventsList is completely empty, returns true if empty
	 */
	function isEventsListEmpty() {
		if (
			Object.keys(JSON.parse(localStorage.getItem(current_user))).length == 0
		) {
			return true;
		}
		return false;
	}
});
