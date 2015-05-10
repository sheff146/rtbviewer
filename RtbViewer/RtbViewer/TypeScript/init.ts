(() => {
	document.addEventListener("DOMContentLoaded", () => {
		var viewer: Viewer;

		var request = new XMLHttpRequest();
		request.open("GET", "//api.realtimeboard.com/objects/74254402", true);
		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = request.responseText;
					var board = <IBoard>JSON.parse(response);

					var viewport = document.getElementById("viewport");

					viewer = new Viewer(board, viewport);
					viewer.addRenderer(new DomRenderer());
					viewer.addRenderer(new CanvasRenderer());
					viewer.render("dom");
				} else {
					throw new Error("Ошибка загрузки данных");
				}
			}
		};
		request.send();
		
		var radioDom = document.getElementById("dom-renderer-switch");
		var radioCanvas = document.getElementById("canvas-renderer-switch");

		var clickHandler = (ev: MouseEvent) => {
			var radio = <HTMLInputElement>ev.target;
			var renderType = radio.value;
			viewer.render(renderType);
		};

		radioDom.addEventListener("click", clickHandler);
		radioCanvas.addEventListener("click", clickHandler);

		//TODO: обработчики на масштабирование
		//TODO: обработчики на перетаскивание
	});
})();