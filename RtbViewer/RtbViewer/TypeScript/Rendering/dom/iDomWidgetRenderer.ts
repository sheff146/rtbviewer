interface IDomWidgetRenderer {
	getWidgetType(): number;
	render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void;
}