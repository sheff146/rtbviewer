class StickerCanvasRenderer implements ICanvasWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, canvas: HTMLCanvasElement, viewportParams: IViewPortParams): void {
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams);
		var stickerImage = new Image();
		var realSize = { width: 223, height: 235 };
		var screenSize = RenderHelper.countScreenSize(realSize, viewportParams, widget.scale);

		stickerImage.onload = () => {
			// ReSharper disable once RedundantTypeCast
			var context = <CanvasRenderingContext2D>canvas.getContext("2d");

			layout.width = screenSize.width;
			layout.height = screenSize.height;
			var x = layout.x - layout.width / 2;
			var y = layout.y - layout.height / 2;

			context.save();
			CanvasWidgetHelper.prepareContext(context, layout);
			context.drawImage(stickerImage, x, y, layout.width, layout.height);
			context.restore();
		};

		stickerImage.src = "assets/sticker.png";
	}
}