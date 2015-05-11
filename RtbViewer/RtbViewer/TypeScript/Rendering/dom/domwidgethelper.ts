class DomWidgetHelper {
	public static createDiv(widget: IWidget, viewBoardCoords: IPosition, viewportSize: ISize): HTMLElement {
		var element = document.createElement("div");

		DomWidgetHelper.setWidgetLayout(element, widget, viewBoardCoords, viewportSize);

		return element;
	}

	public static setWidgetLayout(element: HTMLElement, widget: IWidget, viewBoardCoords: IPosition, viewportSize: ISize):void {
		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewBoardCoords, viewportSize);

		element.style.left = widgetScreenCoords.x + "px";
		element.style.top = widgetScreenCoords.y + "px";
		element.style.transform = RenderHelper.createTransformString(widget);
		element.style.position = "absolute";

		element.id = widget.idStr;
	}

	public static createImage(imgSrc: string, viewBoardCoords: IPosition, viewportSize: ISize): HTMLElement {
		var image = document.createElement("img");
		
		image.onload = () => {
			var realSize = { width: image.width, height: image.height };
			var screenSize = RenderHelper.countScreenSize(realSize, viewBoardCoords, viewportSize);

			image.width = screenSize.width;
			image.height = screenSize.height;
		};
		image.src = imgSrc;

		return image;
	}
}