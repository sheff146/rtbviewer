class StickerDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var realSize = { width: 223, height: 235 };
		var sticker = document.getElementById(widget.idStr);
		var elementExists = sticker ? true : false;

		if (!sticker) {
			sticker = document.createElement("div");

			sticker.innerText = widget.text;
			sticker.id = widget.idStr;

			sticker.style.backgroundImage = "url(assets/sticker.png)";
			sticker.style.backgroundSize = "100%";
		}

		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
		var k = RenderHelper.countMappingScale(viewportParams);
		layout.textAlign = "center";
		layout.fontSize = 40 / k.ky;
		layout.padding = 15 / k.ky;

		DomWidgetHelper.setWidgetLayout(sticker, layout);

		if (!elementExists) {
			layoutBoard.appendChild(sticker);
		}
	}
}