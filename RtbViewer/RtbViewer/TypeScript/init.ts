(() => {
	var board: IBoard = null;
	var currentRenderer: IRenderer = null;
	var renderers = {
		dom: <IRenderer>(new DomRenderer()),
		canvas: <IRenderer>(new CanvasRenderer())
	};

	var request = new XMLHttpRequest();
	request.open("GET", "//api.realtimeboard.com/objects/74254402", true);
	request.onreadystatechange = () => {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var response = request.responseText;
				board = <IBoard>JSON.parse(response);
			} else {
				throw new Error("Ошибка загрузки данных");
			}
		}
	};
	request.send();

	document.addEventListener("DOMContentLoaded",() => {
		var radioDom = document.getElementById("dom-renderer-switch");
		var radioCanvas = document.getElementById("canvas-renderer-switch");

		var clickHandler = (ev: MouseEvent) => {
			var radio = <HTMLInputElement>ev.target;
			var renderType = radio.value;
			var viewport = document.getElementById("viewport");

			if (renderers.hasOwnProperty(renderType)) {
				var newRenderer = (<any>renderers)[renderType];
				if (newRenderer !== currentRenderer) {
					currentRenderer.clear();
					currentRenderer = newRenderer;
					currentRenderer.draw(board, viewport);
				}
			}
		};

		radioDom.addEventListener("click", clickHandler);
		radioCanvas.addEventListener("click", clickHandler);

		//TODO: обработчики на масштабирование
		//TODO: обработчики на перетаскивание
	});
})();