class StickerCanvasRenderer implements ICanvasWidgetRenderer {
	private static stickerSize = { width: 223, height: 235 };

	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void {
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, StickerCanvasRenderer.stickerSize);
		var stickerImage = new Image();

		stickerImage.onload = () => {
			var k = RenderHelper.countMappingScale(viewportParams);
			layout.padding = 15 / k.ky;
			layout.fontSize = 40 / k.ky;
			layout.textAlign = "center";

			context.save();
			CanvasWidgetHelper.prepareContextForBackground(context, layout);
			this.renderBgImage(stickerImage, layout, context);

			CanvasWidgetHelper.prepareContextForText(context, layout);
			context.fillText(widget.text, layout.x, layout.y + layout.padding, layout.width - 2 * layout.padding);
			context.restore();
		};

		stickerImage.src = "assets/sticker.png";
	}

	private renderBgImage(image: HTMLImageElement, layout: ILayoutParams, context: CanvasRenderingContext2D): void {
		var translateX = -layout.width / 2;
		var translateY = -layout.height / 2;

		context.save();
		context.translate(translateX, translateY);
		context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
		context.restore();
	}
}