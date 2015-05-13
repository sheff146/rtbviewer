class TextDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

		var element = document.getElementById(widget.idStr);
		var elementExists = true;
		if (!element) {
			elementExists = false;
			element = document.createElement("div");

			element.innerHTML = widget.text;
			element.id = widget.idStr;

			element.style.lineHeight = "1.2";

			if (widget.style) {
				if (widget.style.ta) {
					element.style.textAlign = RenderHelper.textAlignmentFromString(widget.style.ta);
				}
				if (widget.style.bc) {
					element.style.backgroundColor = RenderHelper.hexColorFromNumber(widget.style.bc);
				}
			}
		}

		DomWidgetHelper.setWidgetLayout(element, layout);

		var k = RenderHelper.countMappingScale(viewportParams);
		var fontSize = 90 / k.ky;
		element.style.fontSize = fontSize + "px";

		if (!elementExists) {
			layoutBoard.appendChild(element);
		}
	}
}