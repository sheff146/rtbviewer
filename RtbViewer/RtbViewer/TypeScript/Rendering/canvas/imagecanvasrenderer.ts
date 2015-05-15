class ImageCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var image = new Image();

		image.onload = () => {
			var realSize = { width: image.naturalWidth, height: image.naturalHeight };
			var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
			
			var translateX = -layout.width / 2;
			var translateY = -layout.height / 2;

			context.save();
			CanvasWidgetHelper.prepareContextForBackground(context, layout);
			context.translate(translateX, translateY);
			context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
			context.restore();
		};

		image.src = widget.url;
	}
}