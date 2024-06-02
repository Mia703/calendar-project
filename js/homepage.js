$(document).ready(function () {
	/* ---------- show mobile navigation ---------- */
	$("#nav-open-btn").on("click", function () {
		$("body").css("overflow", "hidden"); // hide body so you can't scroll away from menu
		$("nav#mobile").show("slide", { direction: "left" }, "slow");
	});

	/* ---------- hide mobile navigation ---------- */
	$("#nav-close-btn").on("click", function () {
		$("body").css("overflow", "auto");
		$("nav#mobile").hide("slide", { direction: "left" }, "slow");
	});

	/* ---------- close mobile navigation on link click ---------- */


	/* ---------- jquery ui accordion ---------- */
	$("#accordion").accordion({
		collapsible: true,
	});

	// manually update the accordion headers
	$(".ui-accordion .ui-accordion-header").css("font-size", "1.2em");
	
	// manually update accordion content
	$(".ui-accordion-content").css("height", "max-content");
});
