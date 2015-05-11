interface ISize {
	width: number;
	height: number;
}

class RenderHelper {
	public static countViewBoardCoords(boardStartPosition: IPosition, viewportSize: ISize): IPosition {
		var rMin = boardStartPosition.a;
		var rMax = boardStartPosition.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var ky = (rMax.y - rMin.y) / vpHeight;
		var commonPart = vpWidth / 2 * ky - (rMax.x - rMin.x) / 2;

		var xMinBoard = rMin.x - commonPart;
		var xMaxBoard = rMax.x + commonPart;

		var viewBoardCoords: IPosition = { a: { x: xMinBoard, y: rMin.y }, b: { x: xMaxBoard, y: rMax.y } }
		return viewBoardCoords;
	}

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