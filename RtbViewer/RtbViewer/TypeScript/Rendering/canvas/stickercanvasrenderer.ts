﻿class StickerCanvasRenderer implements ICanvasWidgetRenderer {
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

			var k = RenderHelper.countMappingScale(viewportParams);
			var padding = 15 / k.ky;
			layout.fontSize = 40 / k.ky;
			layout.textAlign = "center";

			context.save();
			CanvasWidgetHelper.prepareContext(context, layout);
			context.drawImage(stickerImage, x, y, layout.width, layout.height);
			context.fillText(widget.text, layout.x, y + padding, layout.width - 2 * padding);
			context.restore();
		};

		stickerImage.src = "assets/sticker.png";
	}
}