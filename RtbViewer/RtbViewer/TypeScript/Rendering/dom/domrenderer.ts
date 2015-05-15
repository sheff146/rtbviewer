class DomRenderer implements IRenderer {
	private _widgetRenderers: IDictionary<IDomWidgetRenderer> = {};

	constructor() {
		//TODO: фабрику вместо этой хрени
		this.addWidgetRenderer(new StickerDomRenderer());
		this.addWidgetRenderer(new ImageDomRenderer());
		this.addWidgetRenderer(new TextDomRenderer());
	}

	public addWidgetRenderer(widgetRenderer: IDomWidgetRenderer) {
		this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
	}

	public clear(viewport: HTMLElement): void {
		viewport.innerHTML = "";
	}

	public getType(): string {
		return "dom";
	}

	public draw(board: IBoard, viewport: HTMLElement, viewRect: IRect): void {
		var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
		var viewportParams = { rect: viewRect, size: viewportSize };

		var layoutBoard = document.getElementById(board.idStr);
		var layoutExists = true;
		if (!layoutBoard) {
			layoutBoard = this.createLayout(board, viewport);
			layoutExists = false;
		}

		board.widgets.forEach((widget: IWidget) => {
			var renderer = this._widgetRenderers[widget.type];
			if (renderer) {
				renderer.render(widget, layoutBoard, viewportParams);
			}
		});

		if (!layoutExists) {
			viewport.appendChild(layoutBoard);
		}
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