class DomWidgetHelper {
	public static createDiv(widget: IWidget, viewBoardCoords: IRect, viewportSize: ISize): HTMLElement {
		var element = document.createElement("div");
		DomWidgetHelper.setWidgetLayout(element, widget, viewBoardCoords, viewportSize);
		return element;
	}

	public static setWidgetLayout(element: HTMLElement, widget: IWidget, viewBoardCoords: IRect, viewportSize: ISize): void {
		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewBoardCoords, viewportSize);

		element.style.left = widgetScreenCoords.x + "px";
		element.style.top = widgetScreenCoords.y + "px";
		element.style.transform = DomWidgetHelper.createTransformString(widget);
		element.style.position = "absolute";

		element.id = widget.idStr;
	}

	private static createTransformString(widget: IWidget): string {
		var angle = widget.angle || 0;

		var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
		return StringFormatter.format(transformBlank, angle);
	}

	public static createImage(imgSrc: string, viewBoardCoords: IRect, viewportSize: ISize, scale: number): HTMLElement {
		var image = document.createElement("img");

		image.onload = () => {
			var realSize = { width: image.width, height: image.height };
			var screenSize = RenderHelper.countScreenSize(realSize, viewBoardCoords, viewportSize, scale);

			image.width = screenSize.width;
			image.height = screenSize.height;
		};
		image.src = imgSrc;

		return image;
	}
}