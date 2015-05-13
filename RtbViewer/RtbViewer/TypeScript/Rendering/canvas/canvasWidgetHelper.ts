class CanvasWidgetHelper {
	public static prepareContext(context: CanvasRenderingContext2D, layout: ILayoutParams): void {
		var angleRad = (layout.rotate || 0) * Math.PI / 180;
		var xc = layout.x;
		var yc = layout.y;
		var xc1 = xc * Math.cos(angleRad) + yc * Math.sin(angleRad);
		var yc1 = yc * Math.cos(angleRad) - xc * Math.sin(angleRad);

		context.rotate(angleRad);
		context.translate(xc1 - xc, yc1 - yc);
	}

	public static revertContext(context: CanvasRenderingContext2D, layout: ILayoutParams): void {
		var angleRad = (layout.rotate || 0) * Math.PI / 180;
		var xc = layout.x;
		var yc = layout.y;
		var xc1 = xc * Math.cos(angleRad) + yc * Math.sin(angleRad);
		var yc1 = yc * Math.cos(angleRad) - xc * Math.sin(angleRad);

		context.translate(xc - xc1, yc - yc1);
		context.rotate(-angleRad);

	}
}