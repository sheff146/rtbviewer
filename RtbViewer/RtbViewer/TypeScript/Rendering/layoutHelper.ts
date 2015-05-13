class LayoutHelper {
	public static countWidgetLayout(widget: IWidget, viewportParams: IViewPortParams, widgetRealSize: ISize = { width: 0, height: 0 }): ILayoutParams {
		var layout: ILayoutParams = {};
		var widgetRealCoords = { x: widget.x, y: widget.y };
		var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewportParams);
		var widgetScreenSize = RenderHelper.countScreenSize(widgetRealSize, viewportParams, widget.scale);

		layout.width = widgetScreenSize.width;
		layout.height = widgetScreenSize.height;
		layout.x = widgetScreenCoords.x;
		layout.y = widgetScreenCoords.y;
		layout.rotate = widget.angle || 0;

		return layout;
	}
}