module CanvasWidgets {
	var renderHelper = new Helpers.RenderHelper();
	var layoutHelper = new Helpers.LayoutHelper(renderHelper);

	export interface ICanvasWidgetRenderer {
		getWidgetType(): number;
		render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: Rendering.IViewPortParams): void;
	}

	class ImageCanvasRenderer implements ICanvasWidgetRenderer {
		public getWidgetType(): number {
			return 1;
		}

		public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: Rendering.IViewPortParams): void {
			var image = new Image();

			image.onload = () => {
				var realSize = { width: image.naturalWidth, height: image.naturalHeight };
				var layout = layoutHelper.countWidgetLayout(widget, viewportParams, realSize);

				context.save();
				CanvasWidgetHelper.prepareContextForBackground(context, layout);
				context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
				context.restore();
			};

			image.src = widget.url;
		}
	}

	class StickerCanvasRenderer implements ICanvasWidgetRenderer {
		private static stickerSize = { width: 223, height: 235 };

		public getWidgetType(): number {
			return 5;
		}

		public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: Rendering.IViewPortParams): void {
			var layout = layoutHelper.countWidgetLayout(widget, viewportParams, StickerCanvasRenderer.stickerSize);
			var stickerImage = new Image();

			stickerImage.onload = () => {
				var k = renderHelper.countMappingScale(viewportParams);
				layout.padding = 15 / k.ky;
				layout.fontSize = 40 / k.ky;
				layout.textAlign = "center";

				context.save();
				CanvasWidgetHelper.prepareContextForBackground(context, layout);
				context.drawImage(stickerImage, layout.x, layout.y, layout.width, layout.height);
				context.restore();

				context.save();
				CanvasWidgetHelper.prepareContextForText(context, layout);
				context.fillText(widget.text, layout.x, layout.y + layout.padding, layout.width - 2 * layout.padding);
				context.restore();
			};

			stickerImage.src = "assets/sticker.png";
		}
	}

	class TextCanvasRenderer implements ICanvasWidgetRenderer {
		public getWidgetType(): number {
			return 4;
		}

		public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: Rendering.IViewPortParams): void {
			var realSize = { width: widget.width, height: 0 };
			var layout = layoutHelper.countWidgetLayout(widget, viewportParams, realSize);
			var cleanText = this.parseInnerText(widget);

			//чтобы рассчитать ширину текста, надо подготовить canvas, но рендерить его надо после фона,
			//поэтому вот так
			context.save();
			CanvasWidgetHelper.prepareContextForText(context, layout);
			var strings = this.wrapText(cleanText, layout, context);
			layout.height = strings.length * layout.fontSize * layout.lineHeightCoeff;
			context.restore();

			context.save();
			CanvasWidgetHelper.prepareContextForBackground(context, layout);
			context.fillRect(layout.x, layout.y, layout.width, layout.height);
			context.restore();

			CanvasWidgetHelper.prepareContextForText(context, layout);

			for (var i = 0; i < strings.length; i++) {
				var marginTop = i * layout.fontSize * layout.lineHeightCoeff;
				context.fillText(strings[i], layout.x, layout.y + marginTop, layout.width);
			}
		}

		private parseInnerText(widget: IWidget): string[] {
			var parser = new DOMParser();
			var doc = parser.parseFromString(widget.text, "text/html");
			var paragraphs = doc.getElementsByTagName("p");
			var result: string[] = [];

			for (var i = 0; i < paragraphs.length; i++) {
				result.push(paragraphs.item(i).innerText);
			}

			return result;
		}

		private wrapText(paragraphs: string[], layout: Rendering.ILayoutParams, context: CanvasRenderingContext2D): string[] {
			var result: string[] = [];
			var i: number;

			for (i = 0; i < paragraphs.length; i++) {
				var paragraphStrings = this.wrapParagraph(paragraphs[i], layout, context);
				result = result.concat(paragraphStrings);
			}

			return result;
		}

		private wrapParagraph(paragraphText: string, layout: Rendering.ILayoutParams, context: CanvasRenderingContext2D): string[] {
			var result: string[] = [];

			var currentLine = "";
			var testLine: string;
			var testWidth: number;
			var j: number;

			var maxWidth = Math.ceil(layout.width);
			var words = paragraphText.split(" ");

			if (words.length < 2) {
				return words;
			}

			for (j = 0; j < words.length; j++) {
				testLine = currentLine.length === 0
					? words[j]
					: currentLine + " " + words[j];

				testWidth = context.measureText(testLine).width;

				if (testWidth < maxWidth) {
					currentLine = testLine;
				} else {
					result.push(currentLine);
					currentLine = words[j];
				}
			}

			result.push(currentLine);

			return result;
		}
	}

	class CanvasWidgetHelper {
		public static prepareContextForText(context: CanvasRenderingContext2D, layout: Rendering.ILayoutParams): void {
			this.setCommonTransform(context, layout);

			context.textAlign = layout.textAlign
				? layout.textAlign
				: "left";

			var translateX = 0;
			var translateY = -layout.height / 2;

			if (layout.fontSize) {
				context.font = layout.fontSize + "px 'Segoe UI', sans-serif";
				context.textBaseline = "top";
			}

			switch (layout.textAlign) {
				case "center":
					translateX = 0;
					break;
				case "right":
					translateX = layout.width / 2;
					break;
				case "left":
				default:
					translateX = - layout.width / 2;
			}

			context.translate(translateX, translateY);
		}

		private static setCommonTransform(context: CanvasRenderingContext2D, layout: Rendering.ILayoutParams): void {
			var angleRad = (layout.rotate || 0) * Math.PI / 180;
			var delta = CanvasWidgetHelper.countDelta(angleRad, layout);

			context.rotate(angleRad);
			context.translate(delta.deltaX, delta.deltaY);
		}

		public static prepareContextForBackground(context: CanvasRenderingContext2D, layout: Rendering.ILayoutParams): void {
			this.setCommonTransform(context, layout);

			var translateX = -layout.width / 2;
			var translateY = -layout.height / 2;
			context.translate(translateX, translateY);

			context.fillStyle = layout.backgroundColor;
		}

		private static countDelta(angleRad: number, layout: Rendering.ILayoutParams): Rendering.IDeltaPoint {
			var xc = layout.x;
			var yc = layout.y;
			var xc1 = xc * Math.cos(angleRad) + yc * Math.sin(angleRad);
			var yc1 = yc * Math.cos(angleRad) - xc * Math.sin(angleRad);

			return { deltaX: xc1 - xc, deltaY: yc1 - yc };
		}
	}

	export var widgetRenderers: ICanvasWidgetRenderer[] = [
		new ImageCanvasRenderer(),
		new StickerCanvasRenderer(),
		new TextCanvasRenderer()
	];
}