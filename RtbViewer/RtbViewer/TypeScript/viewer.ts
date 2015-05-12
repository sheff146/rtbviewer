class Viewer {
	private _board: IBoard;
	private _viewport: HTMLElement;
	private _renderer: IRenderer;
	private _rendererCollection: IDictionary<IRenderer>;

	private _viewRect: IRect;

	constructor(board: IBoard, viewport: HTMLElement) {
		this._board = board;
		this._viewport = viewport;
		this._rendererCollection = {};
		
		//deep copy по-быстрому
		var jsonPosition = JSON.stringify(board.startPosition);
		var viewRect = JSON.parse(jsonPosition);

		var viewportSize: ISize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
		this._viewRect = RenderHelper.countViewportRect(viewRect, viewportSize);
	}

	public addRenderer(renderer: IRenderer): void {
		var renderType = renderer.getType();
		this._rendererCollection[renderType] = renderer;
	}

	public render(renderType: string): void {
		var newRenderer = this._rendererCollection[renderType];
		if (!newRenderer) {
			throw new TypeError("Не найден тип рендера: " + renderType);
		}

		if (newRenderer !== this._renderer) {
			if (this._renderer) {
				this._renderer.clear(this._viewport);
			}
			this._renderer = newRenderer;
			this._renderer.draw(this._board, this._viewport, this._viewRect);
		}
	}

	public zoom(scaleModifier: number, zoomPoint: IPoint) {
		var viewportSize: ISize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
		var viewportParams = { size: viewportSize, rect: this._viewRect };

		this._viewRect = RenderHelper.countNewZoomRect(scaleModifier, zoomPoint, viewportParams);
		this._renderer.clear(this._viewport);
		this._renderer.draw(this._board, this._viewport, this._viewRect);
	}

	public move(deltaX: number, deltaY: number) {
		var viewportSize: ISize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
		var viewportParams = { size: viewportSize, rect: this._viewRect };
		var delta = { deltaX: deltaX, deltaY: deltaY };

		this._viewRect = RenderHelper.countNewDragRect(delta, viewportParams);
		this._renderer.clear(this._viewport);
		this._renderer.draw(this._board, this._viewport, this._viewRect);
	}
}