class DomWidgetHelper {
	public static createDiv(widget: IWidget, viewportRect: IRect, viewportSize: ISize): HTMLElement {
		var element = document.createElement("div");
		DomWidgetHelper.setWidgetLayout(element, widget, viewportRect, viewportSize);
		return element;
	}

	public static setWidgetLayout(element: HTMLElement, widget: IWidget, viewportRect: IRect, viewportSize: ISize): void {
		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewportRect, viewportSize);

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

	public static createImage(widget: IWidget, viewportRect: IRect, viewportSize: ISize): HTMLElement {
		var image = document.createElement("img");

		image.onload = () => {
			var realSize = { width: image.width, height: image.height };
			var screenSize = RenderHelper.countScreenSize(realSize, viewportRect, viewportSize, widget.scale);

			image.width = screenSize.width;
			image.height = screenSize.height;
		};

		image.src = widget.url;

		return image;
	}

	public static createSticker(widget: IWidget, viewportRect: IRect, viewportSize: ISize): HTMLElement {
		var element = DomWidgetHelper.createDiv(widget, viewportRect, viewportSize);
		var realSize = { width: 223, height: 235 };
		var screenSize = RenderHelper.countScreenSize(realSize, viewportRect, viewportSize, widget.scale);

		element.style.width = screenSize.width + "px";
		element.style.height = screenSize.height + "px";
		element.style.backgroundImage = "url(assets/sticker.png)";
		element.style.backgroundSize = "100%";
		return element;
	}
}