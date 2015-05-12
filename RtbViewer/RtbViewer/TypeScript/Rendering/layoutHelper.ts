class LayoutHelper {
	public static countWidgetLayout(widget: IWidget, viewportRect: IRect, viewportSize: ISize, widgetRealSize: ISize = { width: 0, height: 0 }): ILayoutParams {
		var layout: ILayoutParams = {};
		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewportRect, viewportSize);
		var widgetScreenSize = RenderHelper.countScreenSize(widgetRealSize, viewportRect, viewportSize, widget.scale);

		layout.width = widgetScreenSize.width;
		layout.height = widgetScreenSize.height;
		layout.x = widgetScreenCoords.x;
		layout.y = widgetScreenCoords.y;
		layout.rotate = widget.angle || 0;

		return layout;
	}
}