class ImageRenderer implements IWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportSize: ISize): void {
		var image = DomWidgetHelper.createImage(widget.url, viewBoardCoords, viewportSize);
		DomWidgetHelper.setWidgetLayout(image, widget, viewBoardCoords, viewportSize);
		layoutBoard.appendChild(image);
	}
}