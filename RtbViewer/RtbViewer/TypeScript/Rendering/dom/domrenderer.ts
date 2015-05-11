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
		var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
		var viewBoardCoords = RenderHelper.countViewBoardCoords(board.startPosition, viewportSize);

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
		layout.style.backgroundColor = "#DDDDDD";
		layout.style.left = 0 + "px";
		layout.style.top = 0 + "px";
		layout.style.width = "100%";
		layout.style.height = "100%";

		return layout;
	}
}