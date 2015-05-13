class DomWidgetHelper {
	public static setWidgetLayout(element: HTMLElement, layout: ILayoutParams): void {
		var style = element.style;

		style.position = "absolute";
		style.transform = DomWidgetHelper.createTransformString(layout);

		if (layout.x) {
			style.left = layout.x + "px";
		}
		if (layout.y) {
			style.top = layout.y + "px";
		}
		if (layout.width) {
			style.width = layout.width + "px";
		}
		if (layout.height) {
			style.height = layout.height + "px";
		}
	}

	private static createTransformString(layout: ILayoutParams): string {
		var angle = layout.rotate || 0;

		var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
		return StringFormatter.format(transformBlank, angle);
	}
}