interface ICanvasWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, context: CanvasRenderingContext2D, viewportParams: IViewPortParams): void;
}