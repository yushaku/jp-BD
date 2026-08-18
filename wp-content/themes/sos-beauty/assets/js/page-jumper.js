(function () {
	var sel = document.querySelector(".beauty-page-jumper__select");
	if (!sel) {
		return;
	}
	sel.addEventListener("change", function () {
		if (this.value) {
			window.location.assign(this.value);
		}
	});
})();
