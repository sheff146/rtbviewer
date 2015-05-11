interface ISize {
	width: number;
	height: number;
}

class RenderHelper {
	public static countViewBoardCoords(startPosotion: IRect, viewportSize: ISize): IRect {
		var rMin = startPosotion.a;
		var rMax = startPosotion.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var ky = (rMax.y - rMin.y) / vpHeight;
		var freeSpace = (vpWidth * ky - (rMax.x - rMin.x)) / 2;

		var xMinBoard = rMin.x - freeSpace;
		var xMaxBoard = rMax.x + freeSpace;

		return { a: { x: xMinBoard, y: rMin.y }, b: { x: xMaxBoard, y: rMax.y } }
	}

	public static countScreenCoords(realCoords: IPoint, viewBoardCoords: IRect, viewportSize: ISize): IPoint {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var kx = (vpMax.x - vpMin.x) / vpWidth;
		var ky = (vpMax.y - vpMin.y) / vpHeight;

		return {
			x: (realCoords.x - vpMin.x) / kx,
			y: (realCoords.y - vpMin.y) / ky
		};
	}

	public static countScreenSize(realSize: ISize, viewBoardCoords: IRect, viewportSize: ISize, scale: number): ISize {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var kx = (vpMax.x - vpMin.x) / vpWidth;
		var ky = (vpMax.y - vpMin.y) / vpHeight;

		return {
			width: realSize.width / kx * scale,
			height: realSize.height / ky * scale
		};
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