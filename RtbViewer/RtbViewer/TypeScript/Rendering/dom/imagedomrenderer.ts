class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var image = DomWidgetHelper.createImage(widget, viewportParams);
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams);

		DomWidgetHelper.setWidgetLayout(image, layout);
		image.id = widget.idStr;
		layoutBoard.appendChild(image);
	}
}