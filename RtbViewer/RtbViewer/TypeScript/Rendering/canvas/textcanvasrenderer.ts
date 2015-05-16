class TextCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
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