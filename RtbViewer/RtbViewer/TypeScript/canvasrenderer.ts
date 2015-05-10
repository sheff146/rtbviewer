class CanvasRenderer implements IRenderer {

	clear(): void { }

	draw(board: IBoard, viewport: HTMLElement): void { }

	getType(): string {
		return "canvas";
	}
} 