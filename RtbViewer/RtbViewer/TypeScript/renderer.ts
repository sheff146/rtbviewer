interface IRenderer {
	getType(): string;
	clear(): void;
	draw(board: IBoard, viewport: HTMLElement): void;
} 