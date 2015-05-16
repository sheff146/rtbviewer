class TextDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var realSize = { width: widget.width, height: 0 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

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