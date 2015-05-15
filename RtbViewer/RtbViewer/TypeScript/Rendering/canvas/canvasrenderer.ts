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
		var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
		var viewportParams = { rect: viewRect, size: viewportSize };

		var canvas = <HTMLCanvasElement>document.getElementById(board.idStr);
		if (!canvas) {
			canvas = this.createCanvas(board, viewport);
			viewport.appendChild(canvas);
		}

		// ReSharper disable once RedundantTypeCast
		var context = <CanvasRenderingContext2D>canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);

		board.widgets.forEach((widget: IWidget) => {
			var renderer = this._widgetRenderers[widget.type];
			if (renderer) {
				renderer.render(widget, canvas, viewportParams);
			}
		});
	}

	private createCanvas(board: IBoard, viewport: HTMLElement): HTMLCanvasElement {
		var canvas = document.createElement("canvas");

		canvas.id = board.idStr;
		canvas.style.position = "absolute";
		canvas.style.backgroundColor = "#DDDDDD";
		canvas.style.left = 0 + "px";
		canvas.style.top = 0 + "px";
		canvas.width = viewport.clientWidth;
		canvas.height = viewport.clientHeight;

		return canvas;
	}
} 