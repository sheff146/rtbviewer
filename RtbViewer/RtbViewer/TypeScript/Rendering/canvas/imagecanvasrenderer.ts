class ImageCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, canvas: HTMLCanvasElement, viewportParams: IViewPortParams): void {
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams);
		var image = new Image();

		image.onload = () => {
			var realSize = { width: image.naturalWidth, height: image.naturalHeight };
			var screenSize = RenderHelper.countScreenSize(realSize, viewportParams, widget.scale);
			// ReSharper disable once RedundantTypeCast
			var context = <CanvasRenderingContext2D>canvas.getContext("2d");

			layout.width = screenSize.width;
			layout.height = screenSize.height;
			var x = layout.x - layout.width / 2;
			var y = layout.y - layout.height / 2;

			context.save();
			CanvasWidgetHelper.prepareContext(context, layout);
			context.drawImage(image, x, y, layout.width, layout.height);
			context.restore();
		};

		image.src = widget.url;
	}
}