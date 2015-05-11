class StickerRenderer implements IWidgetRenderer {
	public getWidgetType(): number {
		return 5;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewBoardCoords: IPosition, viewportSize: ISize): void {
		var sticker = DomWidgetHelper.createDiv(widget, viewBoardCoords, viewportSize);
		var bgImage = DomWidgetHelper.createImage("assets/sticker.png", viewBoardCoords, viewportSize);
		var text = this.createSpan(widget.text);

		sticker.appendChild(bgImage);
		sticker.appendChild(text);

		layoutBoard.appendChild(sticker);
	}

	private createSpan(text: string): HTMLElement {
		var textElement = document.createElement("span");

		
		textElement.style.position = "absolute";
		textElement.innerText = text;
		//TODO: настроить размер и стиль текста
		textElement.style.fontSize = "1px";

		return textElement;
	}
}