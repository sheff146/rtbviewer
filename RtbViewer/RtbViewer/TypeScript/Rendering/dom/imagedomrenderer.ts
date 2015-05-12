class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var image = DomWidgetHelper.createImage(widget, viewportRect, viewportSize);
		DomWidgetHelper.setWidgetLayout(image, widget, viewportRect, viewportSize);
		layoutBoard.appendChild(image);
	}
}