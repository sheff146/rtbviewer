interface ICanvasWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, layoutCanvas: HTMLCanvasElement, viewportParams: IViewPortParams): void;
}