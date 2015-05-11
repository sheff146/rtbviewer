class CanvasRenderer implements IRenderer {
	private _widgetRenderers: IDictionary<IWidgetRenderer>;

	public clear(viewport: HTMLElement): void {
		viewport.innerHTML = "";
	}

	public draw(board: IBoard, viewport: HTMLElement): void { }

	public getType(): string {
		return "canvas";
	}
} 