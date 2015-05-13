class StickerDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var sticker = document.getElementById(widget.idStr);
		var elementExists = true;
		if (!sticker) {
			elementExists = false;
			sticker = document.createElement("div");

			sticker.innerText = widget.text;
			sticker.id = widget.idStr;

			sticker.style.backgroundImage = "url(assets/sticker.png)";
			sticker.style.backgroundSize = "100%";

			sticker.style.textAlign = "center";
		}

		var realSize = { width: 223, height: 235 };
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);

		DomWidgetHelper.setWidgetLayout(sticker, layout);

		var k = RenderHelper.countMappingScale(viewportParams);
		sticker.style.fontSize = 40 / k.ky + "px";
		sticker.style.padding = 15 / k.ky + "px";

		if (!elementExists) {
			layoutBoard.appendChild(sticker);
		}
	}
}