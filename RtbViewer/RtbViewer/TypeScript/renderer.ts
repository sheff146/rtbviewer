interface IRenderer {
	clear(): void;
	draw(board: IBoard, viewport: HTMLElement): void;
} 