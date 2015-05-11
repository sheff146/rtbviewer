class TextRenderer implements IWidgetRenderer {
	public getWidgetType(): number {
		return 4;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportSize: ISize): void {
		var element = DomWidgetHelper.createDiv(widget, viewBoardCoords, viewportSize);

		var realSize = { width: widget.width, height: 0 };
		var screenSize = RenderHelper.countScreenSize(realSize, viewBoardCoords, viewportSize);
		element.style.width = screenSize.width + "px";
		element.innerHTML = widget.text;
		this.setUpTextStyle(element);

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

	private setUpTextStyle(element: HTMLElement): void {
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

		//TODO: настроить размер и стиль текста
		element.style.fontSize = "1px";
	}
}