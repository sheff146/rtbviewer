interface IRenderer {
	getType(): string;
	clear(viewport: HTMLElement): void;
	draw(board: IBoard, viewport: HTMLElement, boardRect: IRect): void;
	addWidgetRenderer(widgetRenderer: IDomWidgetRenderer): void;
} 