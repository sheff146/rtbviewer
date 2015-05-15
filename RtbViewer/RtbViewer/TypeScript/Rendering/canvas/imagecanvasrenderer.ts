class ImageCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var image = new Image();

		image.onload = () => {
			var realSize = { width: image.naturalWidth, height: image.naturalHeight };
			var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

			var x = layout.x;// - layout.width / 2;
			var y = layout.y;// - layout.height / 2;
			var translateX = layout.width / 2;
			var translateY = layout.height / 2;

			context.save();
			CanvasWidgetHelper.prepareContext(context, layout);
			context.translate(-translateX, -translateY);
			context.drawImage(image, x, y, layout.width, layout.height);
			context.restore();
		};

		image.src = widget.url;
	}
}