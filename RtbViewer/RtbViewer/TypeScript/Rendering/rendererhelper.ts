interface ISize {
	width: number;
	height: number;
}

class DomRenderHelper {
	public static countScreenCoords(realCoords: IPoint, viewBoardCoords: IPosition, viewportSize: ISize): IPoint {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;

		var kx = (vpMax.x - vpMin.x) / viewportSize.width;
		var ky = (vpMax.y - vpMin.y) / viewportSize.height;

		var xScr = (realCoords.x - vpMin.x) / kx;
		var yScr = (realCoords.y - vpMin.y) / ky;

		return {
			x: xScr,
			y: yScr
		};
	}

	public static createTransformString(widget: IWidget): string {
		var scale = widget.scale || 1;
		var angle = widget.angle || 0;

		var transformBlank = "translate(-50%,-50%) scale({0},{0}) rotate({1}deg)";
		return StringFormatter.format(transformBlank, scale, angle);
	}
}