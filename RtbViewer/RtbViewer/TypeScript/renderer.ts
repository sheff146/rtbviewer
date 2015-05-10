interface IRenderer {
	getType(): string;
	clear(viewport: HTMLElement): void;
	draw(board: IBoard, viewport: HTMLElement): void;
} 