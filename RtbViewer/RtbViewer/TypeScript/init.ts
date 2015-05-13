(() => {
	document.addEventListener("DOMContentLoaded",() => {
		var viewer: Viewer;
		var viewport = document.getElementById("viewport");
		var loader = new BoardLoader();

		loader.loadBoard("74254402",(board: IBoard) => {
			viewer = new Viewer(board, viewport);
			viewer.addRenderer(new DomRenderer());
			viewer.addRenderer(new CanvasRenderer());
			viewer.render("dom");
		});

		var radioDom = document.getElementById("dom-renderer-switch");
		var radioCanvas = document.getElementById("canvas-renderer-switch");

		var switchHandler = (ev: MouseEvent) => {
			var radio = <HTMLInputElement>ev.target;
			var renderType = radio.value;
			viewer.render(renderType);
		};

		radioDom.addEventListener("click", switchHandler);
		radioCanvas.addEventListener("click", switchHandler);

		var btnZoomIn = document.getElementById("zoom-in");
		var btnZoomOut = document.getElementById("zoom-out");

		var zoomHandler = (ev: MouseWheelEvent) => {
			var curTarget = <HTMLElement>ev.currentTarget;
			var zoomMultiplier = 0;
			var zoomPoint = { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 }

			switch (curTarget.id) {
				case "zoom-in":
					zoomMultiplier = -0.1;
					break;
				case "zoom-out":
					zoomMultiplier = 0.1;
					break;
				case "viewport":
					zoomMultiplier = (<any>ev).deltaY > 0 ? 0.1 : -0.1;
					zoomPoint.x = ev.x;
					zoomPoint.y = ev.y;
					break;
			}

			viewer.zoom(zoomMultiplier, zoomPoint);
		};

		btnZoomIn.addEventListener("click", zoomHandler);
		btnZoomOut.addEventListener("click", zoomHandler);
		// ReSharper disable once Html.EventNotResolved
		viewport.addEventListener("wheel", zoomHandler);

		var mousePosition: IPoint = { x: 0, y: 0 };
		var isPressed = false;

		viewport.addEventListener("mousedown",(ev: MouseEvent) => {
			isPressed = true;
			mousePosition.x = ev.x;
			mousePosition.y = ev.y;
		});

		document.addEventListener("mouseup",(ev: MouseEvent) => {
			isPressed = false;
		});

		viewport.addEventListener("mousemove",(ev: MouseEvent) => {
			if (isPressed) {
				var deltaX = ev.x - mousePosition.x;
				var deltaY = ev.y - mousePosition.y;

				mousePosition.x = ev.x;
				mousePosition.y = ev.y;

				viewer.move(deltaX, deltaY);
			}
		});
	});
})();