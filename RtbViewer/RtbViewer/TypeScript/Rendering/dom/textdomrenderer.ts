class TextDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var element = document.createElement("div");
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportRect, viewportSize,realSize);
		DomWidgetHelper.setWidgetLayout(element, layout);
		
		element.innerHTML = widget.text;
		element.id = widget.idStr;
		this.setUpTextStyle(element, viewportRect, viewportSize);

		if (widget.style) {
			if (widget.style.ta) {
				element.style.textAlign = RenderHelper.textAlignmentFromString(widget.style.ta);
			}
			if (widget.style.bc) {
				element.style.backgroundColor = RenderHelper.hexColorFromNumber(widget.style.bc);
			}
		}

		layoutBoard.appendChild(element);
	}

	private setUpTextStyle(element: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var el: any = element;

		if (el.style.msUserSelect) {
			el.style.msUserSelect = "none";
		}
		if (el.style.webkitUserSelect) {
			el.style.webkitUserSelect = "none";
		}
		if (el.style.mozUserSelect) {
			el.style.mozUserSelect = "none";
		}
		if (el.style.userSelect) {
			el.style.userSelect = "none";
		}

		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);

		var fontSize = 90 / k.ky;
		element.style.fontSize = fontSize + "px";

		element.style.lineHeight = "1.2";
	}
}