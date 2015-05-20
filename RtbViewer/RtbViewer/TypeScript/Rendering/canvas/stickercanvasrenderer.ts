class StickerCanvasRenderer implements ICanvasWidgetRenderer {
	private static stickerSize = { width: 223, height: 235 };
	private static stickerImage: HTMLImageElement;

	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, StickerCanvasRenderer.stickerSize);
		var k = RenderHelper.countMappingScale(viewportParams);
		layout.padding = 15 / k.ky;
		layout.fontSize = 40 / k.ky;
		layout.textAlign = "center";

		if (StickerCanvasRenderer.stickerImage) {
			StickerCanvasRenderer.renderStickerImage(widget, context, layout);
		} else {
			StickerCanvasRenderer.stickerImage = new Image();

			StickerCanvasRenderer.stickerImage.onload = () => {
				StickerCanvasRenderer.renderStickerImage(widget, context, layout);
			};

			StickerCanvasRenderer.stickerImage.src = "assets/sticker.png";
		}

		context.save();
		CanvasWidgetHelper.prepareContextForText(context, layout);
		context.fillText(widget.text, layout.x, layout.y + layout.padding, layout.width - 2 * layout.padding);
		context.restore();
	}

	private static renderStickerImage(widget: IWidget, context: CanvasRenderingContext2D, layout: ILayoutParams): void {
		context.save();
		CanvasWidgetHelper.prepareContextForBackground(context, layout);
		context.drawImage(StickerCanvasRenderer.stickerImage, layout.x, layout.y, layout.width, layout.height);
		context.restore();
	}
}