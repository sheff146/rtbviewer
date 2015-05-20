class ImageCanvasRenderer implements ICanvasWidgetRenderer {
	private static images: IDictionary<HTMLImageElement> = {};

	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var image = ImageCanvasRenderer.images[widget.idStr];

		if (image) {
			this.renderImage(image, widget, context, viewportParams);
		} else {
			image = new Image();
			ImageCanvasRenderer.images[widget.idStr] = image;

			image.onload = () => {
				this.renderImage(image, widget, context, viewportParams);
			};

			image.src = widget.url;
		}
	}

	private renderImage(image: HTMLImageElement, widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams) {
		var realSize = { width: image.naturalWidth, height: image.naturalHeight };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

		context.save();
		CanvasWidgetHelper.prepareContextForBackground(context, layout);
		context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
		context.restore();
	}
}