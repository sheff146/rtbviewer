class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IRect, viewportSize: ISize): void {
		var image = DomWidgetHelper.createImage(widget.url, viewBoardCoords, viewportSize, widget.scale);
		DomWidgetHelper.setWidgetLayout(image, widget, viewBoardCoords, viewportSize);
		layoutBoard.appendChild(image);
	}
}