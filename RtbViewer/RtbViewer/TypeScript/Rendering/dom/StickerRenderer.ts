class StickerRenderer implements IWidgetRenderer {
	private static backgroundUrl = "assets/sticker.png";

	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportSize: ISize): void {
		var sticker = document.createElement("div");
		var stickerBackground = this.createBackground(viewBoardCoords, viewportSize);
		var text = this.createText();

		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = DomRenderHelper.countScreenCoords(widgetRealCoords, viewBoardCoords, viewportSize);

		sticker.style.left = widgetScreenCoords.x + "px";
		sticker.style.top = widgetScreenCoords.y + "px";

		sticker.style.transform = DomRenderHelper.createTransformString(widget);

		sticker.id = widget.idStr;
		sticker.style.position = "absolute";

		sticker.appendChild(stickerBackground);
		sticker.appendChild(text);

		layoutBoard.appendChild(sticker);
	}

	private createBackground(viewBoardCoords: IPosition, viewportSize: ISize): HTMLElement {
		var stickerBackground = document.createElement("img");
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;
		var kx = (vpMax.x - vpMin.x) / viewportSize.width;
		var ky = (vpMax.y - vpMin.y) / viewportSize.height;
		//TODO: узнать, как определять размер виджета
		stickerBackground.width = 446 / kx;
		stickerBackground.height = 470 / ky;
		stickerBackground.src = StickerRenderer.backgroundUrl;

		return stickerBackground;
	}

	private createText(): HTMLElement {
		var text = document.createElement("span");

		//TODO: настроить стиль текста
		text.style.position = "absolute";

		return text;
	}
}