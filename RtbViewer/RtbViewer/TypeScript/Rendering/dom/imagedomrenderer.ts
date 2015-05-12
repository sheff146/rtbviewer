class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var image = DomWidgetHelper.createImage(widget, viewportRect, viewportSize);
		var layout = LayoutHelper.countWidgetLayout(widget, viewportRect, viewportSize);

		DomWidgetHelper.setWidgetLayout(image, layout);
		image.id = widget.idStr;
		layoutBoard.appendChild(image);
	}
}