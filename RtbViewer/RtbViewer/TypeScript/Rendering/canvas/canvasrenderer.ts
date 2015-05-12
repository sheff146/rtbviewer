interface ICanvasWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, layoutCanvas: HTMLCanvasElement, viewportParams: IViewPortParams): void;
}

class CanvasRenderer implements IRenderer {
	private _widgetRenderers: IDictionary<ICanvasWidgetRenderer> = {};

	constructor() {
		//TODO: фабрику вместо этой хрени
		this.addWidgetRenderer(new StickerCanvasRenderer());
		this.addWidgetRenderer(new ImageCanvasRenderer());
		this.addWidgetRenderer(new TextCanvasRenderer());
	}

	public addWidgetRenderer(widgetRenderer: ICanvasWidgetRenderer) {
		this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
	}

	public clear(viewport: HTMLElement): void {
		viewport.innerHTML = "";
	}

	public getType(): string {
		return "canvas";
	}

	public draw(board: IBoard, viewport: HTMLElement, viewRect: IRect): void {
		var canvas = this.createCanvas(board, viewport);
		var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
		var viewportParams = { rect: viewRect, size: viewportSize };

		viewport.appendChild(canvas);

		board.widgets.forEach((widget: IWidget) => {
			var renderer = this._widgetRenderers[widget.type];
			if (renderer) {
				renderer.render(widget, canvas, viewportParams);
			}
		});
	}

	private createCanvas(board: IBoard, viewport: HTMLElement): HTMLCanvasElement {
		var layout = document.createElement("canvas");

		layout.id = board.idStr;
		layout.style.position = "absolute";
		layout.style.backgroundColor = "#DDDDDD";
		layout.style.left = 0 + "px";
		layout.style.top = 0 + "px";
		layout.style.width = viewport.clientWidth + "px";
		layout.style.height = viewport.clientHeight + "px";

		return layout;
	}
} 