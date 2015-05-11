﻿interface IDictionary<TValue> {
	[key: string]: TValue;
}

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
		this._viewRect = RenderHelper.countViewBoardCoords(viewRect, viewportSize);
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
		this._viewRect = RenderHelper.countNewViewRect(scaleModifier, zoomPoint, this._viewRect,viewportSize);
		this._renderer.clear(this._viewport);
		this._renderer.draw(this._board, this._viewport, this._viewRect);
	}
}