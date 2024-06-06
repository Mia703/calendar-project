/* ---------- global variables ---------- */
let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let day = today.getDate();

$(document).ready(function () {
	/* =================== calendar =================== */
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
		let tasks = getEvents(year, month, $(this).text());
		$(".tasks").html(tasks);
	});

	/* ---------- updating calendar previous and next buttons ---------- */

	let monthIndex = month; // get the current month
	let yearIndex = year; // get the current year

	// on click of the previous button
	$("button.left.prev").on("click", function () {
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
		// month = monthIndex;
		// year = yearIndex;

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

	// on click of the next button
	$("button.right.next").on("click", function () {
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
		// month = monthIndex;
		// year = yearIndex;

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

	/* =================== local host =================== */
	// FIXME: fix localhost so that all events and dates are associated with PIN
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
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(day),
		};

		let event = {
			title: title,
			desc: description,
			start: startTime,
			end: endTime,
			priority: priority,
		};

		// if the date is not already saved in localhost, save it
		if (localStorage.getItem(JSON.stringify(date)) == null) {
			let eventsList = []; // create an empty eventsList array
			eventsList.push(event); // add the event to the array

			// save to local storage (key = date and value = eventsList)
			localStorage.setItem(JSON.stringify(date), JSON.stringify(eventsList));
		}
		// else, get the saved date and add new event
		else {
			// get the date's eventsList
			let eventsList = JSON.parse(localStorage.getItem(JSON.stringify(date)));

			// add the new event
			eventsList.push(event);

			// resave to local storage
			localStorage.setItem(JSON.stringify(date), JSON.stringify(eventsList));
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
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(day),
		};

		if (localStorage.getItem(JSON.stringify(date)) != null) {
			// get the date's eventsList
			let eventsList = JSON.parse(localStorage.getItem(JSON.stringify(date)));
			// return the events as string
			let eventsString = "";
			for (let i = 0; i < eventsList.length; i++) {
				eventsString += createTask(
					eventsList[i].title,
					eventsList[i].desc,
					eventsList[i].start,
					eventsList[i].end,
					eventsList[i].priority
				);
			}
			return eventsString;
		} else {
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
		if (getEvents(year, month, day) != "") {
			return true;
		} else {
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
		// if the 'date' has events
		if (localStorage.getItem(JSON.stringify(date)) != null) {
			// get the date's eventsList
			let eventsList = JSON.parse(localStorage.getItem(JSON.stringify(date)));

			if (eventsList.length == 1) {
				localStorage.removeItem(JSON.stringify(date));
				return 0;
			} else {
				// iterate through the events list and find the specified event
				for (let i = 0; i < eventsList.length; i++) {
					// if the event is in the events list (= the first event that matches)
					if (JSON.stringify(event) == JSON.stringify(eventsList[i])) {
						// remove the event from the array
						eventsList.splice(i, 1);
						break; // exit the loop
					}
				}

				// update local storage
				localStorage.setItem(JSON.stringify(date), JSON.stringify(eventsList));
				return 1;
			}
		}
	}

	/* =================== task list =================== */
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

	$("#dayOfWeek").text(getDayOfWeek(today.getDay()));
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
		$("#newTaskDialog").dialog(); // open the form
	});

	$("#newTaskForm").on("submit", function (event) {
		event.preventDefault(); // prevent the default submission

		// get form inputs
		let title = $("input#title").val();
		let description = $("textarea#description").val();
		let startTime = $("input#startTime").val(); // military time - 09:00
		let endTime = $("input#endTime").val(); // military time
		let priority = $("select#priority").val();

		// add the 'event' tag to the currently selected day
		if ($(".day").hasClass("active")) {
			$(".day.active").addClass("event");
		}
		else {
			$(".day.today").addClass("event");
		}

		// create the task and add to task list container
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

		// save task to localhost
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
		// create a date object
		let date = {
			year: Number(year),
			month: Number(month),
			day: Number(
				$(".day.active").text()
					? $(".day.active").text()
					: $(".day.today").text()
			),
		};

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

		// console.log(date);
		// console.log(event);
		console.log($(this).closest(".task"));

		// remove the task from local storage
		let index = removeEvent(date, event);
		console.log(index);
		if (index == 0) {
			// remove the event tag
			if ($(".day").hasClass("active")) {
				$(".day.active").removeClass("event");
			}
			else {
				$(".day.today").removeClass("event");
			}
		}
		$(this).closest(".task").remove(); // remove the task from tasks list view
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
});
