class ImageCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var image = new Image();

		image.onload = () => {
			var realSize = { width: image.naturalWidth, height: image.naturalHeight };
			var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

			context.save();
			CanvasWidgetHelper.prepareContextForBackground(context, layout);
			context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
			context.restore();
		};

		image.src = widget.url;
	}
}