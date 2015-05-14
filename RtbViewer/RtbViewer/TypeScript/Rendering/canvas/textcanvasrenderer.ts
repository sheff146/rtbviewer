class TextCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, canvas: HTMLCanvasElement, viewportParams: IViewPortParams): void {
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
		var context = <CanvasRenderingContext2D>canvas.getContext("2d");

		var k = RenderHelper.countMappingScale(viewportParams);
		layout.fontSize = 90 / k.ky;
		if (widget.style && widget.style.ta) {
			layout.textAlign = RenderHelper.textAlignmentFromString(widget.style.ta);
		}

		context.save();

		CanvasWidgetHelper.prepareContext(context, layout);
		var marginTop = 0;
		var lineHeight = 1.2;
		var strings = this.wrapText(widget.text, layout, context);
		layout.height = strings.length * layout.fontSize * lineHeight;
		if (widget.style && widget.style.bc) {
			layout.backgroundColor = RenderHelper.hexColorFromNumber(widget.style.bc);
		}

		var x = layout.x;
		switch (layout.textAlign) {
			case "right":
				x = layout.x + layout.width / 2;
				break;
			case "left":
			default:
				x = layout.x - layout.width / 2;
		}
		var y = layout.y - layout.height / 2;

		if (layout.backgroundColor) {
			context.save();
			context.fillStyle = layout.backgroundColor;
			context.fillRect(x, y, layout.width, layout.height);
			context.restore();
		}
		for (var i = 0; i < strings.length; i++) {
			marginTop = i * layout.fontSize * lineHeight;
			context.fillText(strings[i], x, y + marginTop, layout.width);
		}

		context.restore();
	}

	private wrapText(text: string, layout: ILayoutParams, context: CanvasRenderingContext2D): string[] {
		var words = text.split(" ");
        var countWords = words.length;
        var line = "";
		var maxWidth = layout.width;
		var result: string[] = [];

        for (var n = 0; n < countWords; n++) {
            var testLine = line + words[n] + " ";
            var testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth) {
				result.push(line);
                line = words[n] + " ";
            }
            else {
                line = testLine;
            }
        }

		return result;
	}
}