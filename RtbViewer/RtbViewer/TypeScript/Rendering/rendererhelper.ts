interface ISize {
	width: number;
	height: number;
}

class RenderHelper {
	public static countScreenCoords(realCoords: IPoint, viewBoardCoords: IPosition, viewportSize: ISize): IPoint {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;

		var kx = (vpMax.x - vpMin.x) / viewportSize.width;
		var ky = (vpMax.y - vpMin.y) / viewportSize.height;

		return {
			x: (realCoords.x - vpMin.x) / kx,
			y: (realCoords.y - vpMin.y) / ky
		};
	}

	public static countScreenSize(realSize: ISize, viewBoardCoords: IPosition, viewportSize: ISize): ISize {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;

		var kx = (vpMax.x - vpMin.x) / viewportSize.width;
		var ky = (vpMax.y - vpMin.y) / viewportSize.height;

		return {
			width: realSize.width / kx,
			height: realSize.height / ky
		};
	}

	public static createTransformString(widget: IWidget): string {
		var scale = widget.scale || 1;
		var angle = widget.angle || 0;

		var transformBlank = "translate(-50%,-50%) scale({0},{0}) rotate({1}deg)";
		return StringFormatter.format(transformBlank, scale, angle);
	}

	public static hexColorFromNumber(bc: number): string {
		return "#" + bc.toString(16);
	}

	public static textAlignmentFromString(ta: string): string {
		switch (ta) {
			case "l":
				return "left";
			case "c":
				return "center";
			case "r":
				return "right";
			default:
				return "left";
		}
	}
}