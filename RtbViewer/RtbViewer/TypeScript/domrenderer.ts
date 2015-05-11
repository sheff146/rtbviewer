class DomRenderer implements IRenderer {
	private _widgetRenderers: IDictionary<IWidgetRenderer> = {};

	constructor() {
		//TODO: фабрику вместо этой хрени
		this.addWidgetRenderer(new StickerRenderer());
	}

	public addWidgetRenderer(widgetRenderer: IWidgetRenderer) {
		this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
	}

	public clear(viewport: HTMLElement): void {
		viewport.innerHTML = "";
	}

	public draw(board: IBoard, viewport: HTMLElement): void {
		var layoutBoard = this.createLayout(board, viewport);
		var a = board.startPosition.a;
		var b = board.startPosition.b;

		var commonPart = viewport.clientWidth / 2 * (b.x - a.x) / viewport.clientHeight - (b.x - a.x) / 2;

		var xMinBoard = a.x - commonPart;
		var xMaxBoard = b.x + commonPart;

		var viewBoardCoords: IPosition = { a: { x: xMinBoard, y: a.y }, b: { x: xMaxBoard, y: b.y } }

		board.widgets.forEach((widget: IWidget) => {
			var renderer = this._widgetRenderers[widget.type];
			if (renderer) {
				renderer.render(widget, layoutBoard, viewBoardCoords, viewport.clientWidth, viewport.clientHeight);
			}
		});

		viewport.appendChild(layoutBoard);
	}

	public getType(): string {
		return "dom";
	}

	public createLayout(board: IBoard, viewport: HTMLElement): HTMLElement {
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

interface IWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportWidth: number, viewportHeight: number): void;
}

class RenderHelper {
	public static countScreenCoords(realCoords: IPoint, viewBoardCoords: IPosition, viewportWidth: number, viewportHeight: number): IPoint {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;

		var kx = (vpMax.x - vpMin.x) / viewportWidth;
		var ky = (vpMax.y - vpMin.y) / viewportHeight;

		var xScr = (realCoords.x - vpMin.x) / kx;
		var yScr = (realCoords.y - vpMin.y) / ky;

		return {
			x: xScr,
			y: yScr
		};
	}
}

class StickerRenderer implements IWidgetRenderer {
	private static backgroundImage = "assets/sticker.png";

	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportWidth: number, viewportHeight: number): void {
		var sticker = document.createElement("div");
		var stickerBackground = document.createElement("img");
		var text = document.createElement("span");

		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;
		var kx = (vpMax.x - vpMin.x) / viewportWidth;
		var ky = (vpMax.y - vpMin.y) / viewportHeight;

		stickerBackground.src = StickerRenderer.backgroundImage;
		stickerBackground.width = 446 / kx;
		stickerBackground.height = 470 / ky;

		sticker.appendChild(stickerBackground);
		sticker.appendChild(text);

		text.style.position = "absolute";

		sticker.id = widget.idStr;
		sticker.style.position = "absolute";

		var widgetScreenCoords = RenderHelper.countScreenCoords({ x: widget.x, y: widget.y }, viewBoardCoords, viewportWidth, viewportHeight);
		sticker.style.left = widgetScreenCoords.x + "px";
		sticker.style.top = widgetScreenCoords.y + "px";
		sticker.style.transform = this.createTransformString(widget);
		//TODO: настроить стиль текста

		layoutBoard.appendChild(sticker);
	}

	private createTransformString(widget: IWidget): string {
		var scale: number = widget.scale || 1;
		var angle: number = widget.angle || 0;

		var transformBlank = "translate(-50%,-50%) scale({0},{0}) rotate({1}deg)";
		return StringFormatter.format(transformBlank, scale, angle);
	}
}

class StringFormatter {
	static format(format: string, ...elements: any[]): string {
		var str = format;
        if (!elements.length)
            return str;

		for (var arg in elements)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), elements[arg]);

        return str;
	}
}