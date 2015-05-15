class TextCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

		CanvasWidgetHelper.prepareContextForBackground(context, layout);

		var cleanText = this.parseInnerText(widget);
		var strings = this.wrapText(cleanText, layout, context);
		layout.height = strings.length * layout.fontSize * layout.lineHeightCoeff;

		if (layout.backgroundColor) {
			context.save();
			var translateX = -layout.width / 2;
			var translateY = -layout.height / 2;
			context.fillStyle = layout.backgroundColor;
			context.translate(translateX, translateY);
			context.fillRect(layout.x, layout.y, layout.width, layout.height);
			context.restore();
		}

		CanvasWidgetHelper.prepareContextForText(context, layout);

		var marginTop = 0;
		for (var i = 0; i < strings.length; i++) {
			marginTop = i * layout.fontSize * layout.lineHeightCoeff;
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

	private wrapText(paragraphs: string[], layout: ILayoutParams, context: CanvasRenderingContext2D): string[] {
		var result: string[] = [];
		var i: number;

		for (i = 0; i < paragraphs.length; i++) {
			var paragraphStrings = this.wrapParagraph(paragraphs[i], layout, context);
			result = result.concat(paragraphStrings);
		}

		return result;
	}

	private wrapParagraph(paragraphText: string, layout: ILayoutParams, context: CanvasRenderingContext2D): string[] {
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