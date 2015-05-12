class StickerDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var sticker = DomWidgetHelper.createSticker(widget, viewportRect, viewportSize);

		sticker.innerText = widget.text;

		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);
		var fontSize = 40 / k.ky;
		sticker.style.fontSize = fontSize + "px";
		sticker.style.lineHeight = "1.2";
		sticker.style.padding = 15 / k.ky + "px";
		sticker.style.textAlign = "center";

		layoutBoard.appendChild(sticker);
	}
}