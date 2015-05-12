class StickerDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportRect: IRect, viewportSize: ISize): void {
		var sticker = document.createElement("div");
		var realSize = { width: 223, height: 235 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportRect, viewportSize, realSize);
		DomWidgetHelper.setWidgetLayout(sticker, layout);

		sticker.style.backgroundImage = "url(assets/sticker.png)";
		sticker.style.backgroundSize = "100%";

		sticker.innerText = widget.text;
		sticker.id = widget.idStr;

		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);
		sticker.style.fontSize = 40 / k.ky + "px";
		sticker.style.lineHeight = "1.2";
		sticker.style.padding = 15 / k.ky + "px";
		sticker.style.textAlign = "center";

		layoutBoard.appendChild(sticker);
	}
}