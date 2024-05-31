$(document).ready(function () {
	// TODO: separate js files into calendar and task js files

	/* ---------- get today's date ---------- */
	let today = new Date();
	// console.log("Today's Date = " + today);

	let month = today.getMonth();
	// console.log("Today's Month = " + month);

	let year = today.getFullYear();
	// console.log("Today's Year = "+ year);

	let day = today.getDate();
	// console.log("Today's day = " + day)

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

	function getCurrentMonth(month, year) {
		return monthsList[month] + " " + year;
	}

	$("#currMonth").text(getCurrentMonth(month, year));

	/* ---------- updating calendar ---------- */
	/* helper functions */
	// adds the current month's days (1 to 30/31)
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

	// adds the previous month's days
	// weekday = 0 to 6 corresponding to Saturday through Sunday
	// calendarNumber = last day of prev month, as number
	function addPrevMonth_Days(weekday, calendarNumber) {
		let text = "";
		for (let i = weekday; i > 0; i--) {
			text += `<div class="day prev-day">${calendarNumber - i + 1}</div>`;
		}
		return text;
	}

	// adds the next month's days
	function addNextMonth_Days(daysLeft) {
		let text = "";
		for (let i = 1; i <= daysLeft; i++) {
			text += `<div class="day next-day">${i}</div>`;
		}
		return text;
	}

	/* returns the calendar for the current month */
	function getCalendar(month, year) {
		// ------------- current month -------------
		// returns the first day of the current month, as a date
		const firstDayOf_currMonth = new Date(year, month, 1);

		// returns the last day of the current month, as a date
		const lastDayOf_currMonth = new Date(year, month + 1, 0);

		// returns the first day of the current month, as a number
		const firstDayOf_currMonth_Number = firstDayOf_currMonth.getDate();

		// returns the last day of the current month, as a number
		const lastDayOf_currMonth_Number = lastDayOf_currMonth.getDate();

		// ------------- previous month -------------
		// returns the last day of the previous month, as a date
		const lastDayOf_preMonth = new Date(year, month, 0);

		// returns the last day of the previous month, as a number
		const lastDayOf_prevMonth_Number = lastDayOf_preMonth.getDate();

		// ------------- other -------------
		const nextDays = 7 - lastDayOf_currMonth.getDate() - 1;

		// ------------- adding days to string -------------
		let day = "";

		// adds the previous month's days
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

		// adds the next month's days
		day += addNextMonth_Days(daysLeft);
		// console.log(day);
		return day;
	}

	/* displays the calendar for the current month */
	let currentContent = $(".container.days").html();
	$(".container.days").html(currentContent + getCalendar(month, year));

	/* ---------- updating calendar previous and next buttons ---------- */

	let monthIndex = month; // get the current month
	let yearIndex = year; // get the current year

	// on click of the previous button
	$("#prevButton").on("click", function () {
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

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

	// on click of the next button
	$("#nextButton").on("click", function () {
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

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
	});

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

	// returns today's day of week (Sunday through Saturday)
	function getDayOfWeek(index) {
		return dayOfWeek[index];
	}

	// returns today as "Month day, year"
	function getFullDate(day, month, year) {
		return monthsList[month] + " " + day + ", " + year;
	}

	$("#dayOfWeek").text(getDayOfWeek(today.getDay()));
	$("#fullDate").text(getFullDate(today.getDate(), month, year));

	/* ---------- select day ---------- */
	// updates clicked "day" element with "active" styling
	// returns clicked day's events for tasks list
	$(document).on("click", ".day", function () {
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

	/* ---------- default tasks container display ---------- */
	// if the current day has tasks, display them
	$(".tasks").html(hasEvents(year, month, day) ? getEvents(year, month, day) : `<p>No tasks today!</p>`);

	/* ---------- adding a task ---------- */

	// on click of add task button, display new task dialog form
	$("#addTaskButton").on("click", function () {
		// $("#newTaskForm").trigger("reset"); // reset the form values (just in case there's still values there)
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
		$(".day.today").addClass("event");

		// create the task and add to task list container
		const currentTasks = $(".tasks").html(); // what's currently in the task list
		
		// if "No tasks today!" is present, remove upon creation of first task
		if (currentTasks == "<p>No tasks today!</p>") {
			$(".tasks").html(createTask(title, description, startTime, endTime, priority)
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
		saveEvent(
			year,
			month,
			$(".day.today").text(),
			title,
			description,
			startTime,
			endTime,
			priority
		);

		// $("#newTaskForm").trigger("reset"); // reset the form values
		$("#newTaskDialog").dialog("close"); // close the form
	});

	// creates a task
	function createTask(title, description, startTime, endTime, priority) {
		let task = `<div class="task">
					<div class="content container">
						<div>
							<p class="title">${title}</p>
							<p class="time">${formatTime(startTime)} - ${formatTime(endTime)}</p>
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

	// formats the time to HH:mm AM ? PM
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

	// TODO: (later) format task based on priority level
	// function formatPriority(priority) {}

	/* ---------- removing a task ---------- */

	// on click of trash button, remove task
	$(document).on("click", "button.trash", function () {
		$(this).closest(".task").remove();
	});

	/* ---------- localhost methods ---------- */

	// save task to localhost
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

	// get tasks from localhosts
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

	// returns 'true' if date has events
	function hasEvents(year, month, day) {
		if (getEvents(year, month, day) != "") {
			return true;
		} else {
			return false;
		}
	}

	// TODO: remove event from local storage
	function removeEvent () {
		
	}
});
