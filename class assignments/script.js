document.addEventListener("click", function (event) {
	if (!event.target.matches("#doggyButton")) return;

	fetch("https://dog.ceo/api/breeds/image/random")
		.then((response) => response.json())
		.then((data) => renderDoggy(data));
});


function renderDoggy(data) {
	const picture = document.getElementById("picture");
	picture.src = data.message;
}