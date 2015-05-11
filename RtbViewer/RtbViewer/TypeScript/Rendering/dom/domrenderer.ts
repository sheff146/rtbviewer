interface IWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportSize: ISize): void;
}

class DomRenderer implements IRenderer {
	private _widgetRenderers: IDictionary<IWidgetRenderer> = {};

	constructor() {
		//TODO: фабрику вместо этой хрени
		this.addWidgetRenderer(new StickerRenderer());
		this.addWidgetRenderer(new ImageRenderer());
		this.addWidgetRenderer(new TextRenderer());
	}

	public addWidgetRenderer(widgetRenderer: IWidgetRenderer) {
		this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
	}

	public clear(viewport: HTMLElement): void {
		viewport.innerHTML = "";
	}

	public getType(): string {
		return "dom";
	}

	public draw(board: IBoard, viewport: HTMLElement): void {
		var layoutBoard = this.createLayout(board, viewport);
		var rMin = board.startPosition.a;
		var rMax = board.startPosition.b;

		var commonPart = viewport.clientWidth / 2 * (rMax.x - rMin.x) / viewport.clientHeight - (rMax.x - rMin.x) / 2;

		var xMinBoard = rMin.x - commonPart;
		var xMaxBoard = rMax.x + commonPart;

		var viewBoardCoords: IPosition = { a: { x: xMinBoard, y: rMin.y }, b: { x: xMaxBoard, y: rMax.y } }
		var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };

		board.widgets.forEach((widget: IWidget) => {
			var renderer = this._widgetRenderers[widget.type];
			if (renderer) {
				renderer.render(widget, layoutBoard, viewBoardCoords, viewportSize);
			}
		});

		viewport.appendChild(layoutBoard);
	}

	private createLayout(board: IBoard, viewport: HTMLElement): HTMLElement {
		var layout = document.createElement("div");

		layout.id = board.idStr;
		layout.style.position = "absolute";
		layout.style.backgroundColor = "gray";
		layout.style.left = 0 + "px";
		layout.style.top = 0 + "px";
		layout.style.width = "100%";
		layout.style.height = "100%";

		return layout;
	}
}