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

		this.setUpTextParams(widget, layout, viewportParams);

		return layout;
	}

	private static setUpTextParams(widget: IWidget, layout: ILayoutParams, viewportParams: IViewPortParams) {
		var k = RenderHelper.countMappingScale(viewportParams);

		layout.fontSize = 90 / k.ky;
		layout.lineHeightCoeff = 1.2;

		var ta = widget.style && widget.style.ta ? widget.style.ta : "";
		layout.textAlign = RenderHelper.textAlignmentFromString(ta);

		var bc = widget.style && widget.style.bc >= 0 ? widget.style.bc : -1;
		layout.backgroundColor = RenderHelper.hexColorFromNumber(bc);
	}
}