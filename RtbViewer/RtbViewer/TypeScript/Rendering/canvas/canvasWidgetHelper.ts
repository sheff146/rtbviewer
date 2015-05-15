class CanvasWidgetHelper {
	public static prepareContext(context: CanvasRenderingContext2D, layout: ILayoutParams): void {
		var angleRad = (layout.rotate || 0) * Math.PI / 180;
		var delta = CanvasWidgetHelper.countDelta(angleRad, layout);

		context.rotate(angleRad);
		context.translate(delta.deltaX, delta.deltaY);

		if (layout.fontSize) {
			context.font = layout.fontSize + "px 'Segoe UI', sans-serif";
			context.textBaseline = "top";
		}

		context.textAlign = layout.textAlign
			? layout.textAlign
			: "left";
	}

	private static countDelta(angleRad: number, layout: ILayoutParams): IDeltaPoint {
		var xc = layout.x;
		var yc = layout.y;
		var xc1 = xc * Math.cos(angleRad) + yc * Math.sin(angleRad);
		var yc1 = yc * Math.cos(angleRad) - xc * Math.sin(angleRad);

		return { deltaX: xc1 - xc, deltaY: yc1 - yc };
	}
}