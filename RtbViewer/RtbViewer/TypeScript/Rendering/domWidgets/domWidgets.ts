module DomWidgets {
	var renderHelper = new Rendering.RenderHelper();
	var layoutHelper = new Rendering.LayoutHelper(renderHelper);

	export var widgetRenderers: IDomWidgetRenderer[] = [
		new ImageDomRenderer(),
		new StickerDomRenderer(),
		new TextDomRenderer()
	];

	export interface IDomWidgetRenderer {
		getWidgetType(): number;
		render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: Rendering.IViewPortParams): void;
	}

	class ImageDomRenderer implements IDomWidgetRenderer {
		public getWidgetType(): number {
			return 1;
		}

		public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: Rendering.IViewPortParams): void {
			var layout: Rendering.ILayoutParams;
			var image = <HTMLImageElement>document.getElementById(widget.idStr);

			if (!image) {
				image = document.createElement("img");
				image.ondragstart = () => { return false; };

				image.onload = () => {
					layout = this.countImageLayout(image, widget, viewportParams);
					DomWidgetHelper.setWidgetLayout(image, layout);
					layoutBoard.appendChild(image);
				};

				image.src = widget.url;
				image.id = widget.idStr;
			} else {
				layout = this.countImageLayout(image, widget, viewportParams);
				DomWidgetHelper.setWidgetLayout(image, layout);
			}
		}

		private countImageLayout(image: HTMLImageElement, widget: IWidget, viewportParams: Rendering.IViewPortParams): Rendering.ILayoutParams {
			var realSize = { width: image.naturalWidth, height: image.naturalHeight };
			return layoutHelper.countWidgetLayout(widget, viewportParams, realSize);
		}
	}

	class StickerDomRenderer implements IDomWidgetRenderer {
		public getWidgetType(): number {
			return 5;
		}

		public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: Rendering.IViewPortParams): void {
			var realSize = { width: 223, height: 235 };
			var sticker = document.getElementById(widget.idStr);
			var elementExists = sticker ? true : false;

			if (!sticker) {
				sticker = document.createElement("div");

				sticker.innerText = widget.text;
				sticker.id = widget.idStr;

				sticker.style.backgroundImage = "url(assets/sticker.png)";
				sticker.style.backgroundSize = "100%";
			}

			var layout = layoutHelper.countWidgetLayout(widget, viewportParams, realSize);
			var k = renderHelper.countMappingScale(viewportParams);
			layout.textAlign = "center";
			layout.fontSize = 40 / k.ky;
			layout.padding = 15 / k.ky;

			DomWidgetHelper.setWidgetLayout(sticker, layout);

			if (!elementExists) {
				layoutBoard.appendChild(sticker);
			}
		}
	}

	class TextDomRenderer implements IDomWidgetRenderer {
		public getWidgetType(): number {
			return 4;
		}

		public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: Rendering.IViewPortParams): void {
			var realSize = { width: widget.width, height: 0 };
			var layout = layoutHelper.countWidgetLayout(widget, viewportParams, realSize);

			var element = document.getElementById(widget.idStr);
			var elementExists = element ? true : false;

			if (!element) {
				element = document.createElement("div");
				element.innerHTML = widget.text;
				element.id = widget.idStr;
			}

			DomWidgetHelper.setWidgetLayout(element, layout);

			if (!elementExists) {
				layoutBoard.appendChild(element);
			}
		}
	}

	class DomWidgetHelper {
		public static setWidgetLayout(element: HTMLElement, layout: Rendering.ILayoutParams): void {
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

			if (layout.lineHeightCoeff) {
				element.style.lineHeight = layout.lineHeightCoeff.toString();
			}

			if (layout.backgroundColor) {
				element.style.backgroundColor = layout.backgroundColor;
			}

			if (layout.textAlign) {
				element.style.textAlign = layout.textAlign;
			}

			if (layout.fontSize >= 0) {
				element.style.fontSize = layout.fontSize + "px";
			}

			if (layout.padding >= 0) {
				element.style.padding = layout.padding + "px";
			}
		}

		private static createTransformString(layout: Rendering.ILayoutParams): string {
			var angle = layout.rotate || 0;

			var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
			return StringFormatter.format(transformBlank, angle);
		}
	}
}