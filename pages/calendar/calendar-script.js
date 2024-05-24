$(document).ready(function () {
	// TODO: separate js files into calendar and task js files
	
	/* ---------- get today's date ---------- */
	let today = new Date();
	// console.log("Today's Date = " + today);

	let month = today.getMonth();
	// console.log("Today's Month = " + month);

	let year = today.getFullYear();
	// console.log("Today's Year = "+ year);

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
				text += `<div class="day today">${i}</div>`;
			} else {
				text += `<div class="day">${i}</div>`;
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

		// update the month header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
		// console.log(monthIndex + ", " + yearIndex)
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

		// update the mont header
		$("#currMonth").text(getCurrentMonth(monthIndex, yearIndex));
		// update the calendar
		$(".container.days").html(
			currentContent + getCalendar(monthIndex, yearIndex)
		);
		// console.log(monthIndex + ", " + yearIndex)
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

	// TODO: this needs to update on prev and next months
	$(".day").on("click", function () {
		// TODO: update calendar to current date too
		let clickedDate = new Date(year, month, $(this).html())
		// console.log(clickedDate)
		$("#dayOfWeek").text(getDayOfWeek(clickedDate.getDay()));
		$("#fullDate").text(getFullDate(clickedDate.getDate(), month, year));
	})

	/* ---------- add task button ---------- */

	// on click of add task button, display new task dialog form
	$("#addTaskButton").on("click", function () {
		$("#newTaskDialog").dialog();
	});

	// TODO: insert form validation  here
});
