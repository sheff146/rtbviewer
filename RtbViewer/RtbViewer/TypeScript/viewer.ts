interface IDictionary<TValue> {
	[key: string]: TValue;
}

class Viewer {
	private _board: IBoard;
	private _viewport: HTMLElement;
	private _renderer: IRenderer;
	private _rendererCollection: IDictionary<IRenderer>;

	constructor(board: IBoard, viewport: HTMLElement) {
		this._board = board;
		this._viewport = viewport;
		this._rendererCollection = {};
	}

	public render(renderType: string): void {
		var newRenderer = this._rendererCollection[renderType];
		if (!newRenderer) {
			throw new TypeError("Не найден тип рендера: " + renderType);
		}

		if (newRenderer !== this._renderer) {
			this._renderer.clear();
			this._renderer = newRenderer;
			this._renderer.draw(this._board, this._viewport);
		}
	}

	public addRenderer(renderer: IRenderer): void {
		var renderType = renderer.getType();
		this._rendererCollection[renderType] = renderer;
	}
}