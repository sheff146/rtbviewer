class DomWidgetHelper {
	public static setWidgetLayout(element: HTMLElement, layout: ILayoutParams): void {
		var style = element.style;

		style.position = "absolute";
		style.transform = DomWidgetHelper.createTransformString(layout);

		if (layout.x) {
			style.left = layout.x + "px";
		}
		if (layout.y) {
			style.top = layout.y + "px";
		}
		if (layout.width) {
			style.width = layout.width + "px";
		}
		if (layout.height) {
			style.height = layout.height + "px";
		}
	}

	private static createTransformString(layout: ILayoutParams): string {
		var angle = layout.rotate || 0;

		var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
		return StringFormatter.format(transformBlank, angle);
	}

	public static createImage(widget: IWidget, viewportParams: IViewPortParams): HTMLElement {
		var image = document.createElement("img");

		image.onload = () => {
			var realSize = { width: image.width, height: image.height };
			var screenSize = RenderHelper.countScreenSize(realSize, viewportParams, widget.scale);

			image.width = screenSize.width;
			image.height = screenSize.height;
		};

		image.src = widget.url;

		return image;
	}

	public static createSticker(widget: IWidget, viewportParams: IViewPortParams): HTMLElement {
		var sticker = document.createElement("div");
		var realSize = { width: 223, height: 235 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
		DomWidgetHelper.setWidgetLayout(sticker, layout);

		sticker.style.backgroundImage = "url(assets/sticker.png)";
		sticker.style.backgroundSize = "100%";
		return sticker;
	}
}