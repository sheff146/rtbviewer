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

	private static countMappingScale(viewBoardCoords: IRect, viewportSize: ISize): { kx: number; ky: number } {
		var vpMin = viewBoardCoords.a;
		var vpMax = viewBoardCoords.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var kx = (vpMax.x - vpMin.x) / vpWidth;
		var ky = (vpMax.y - vpMin.y) / vpHeight;

		return { kx: kx, ky: ky };
	}

	public static countScreenCoords(realCoords: IPoint, viewBoardCoords: IRect, viewportSize: ISize): IPoint {
		var vpMin = viewBoardCoords.a;
		var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);

		return {
			x: (realCoords.x - vpMin.x) / k.kx,
			y: (realCoords.y - vpMin.y) / k.ky
		};
	}

	public static countScreenSize(realSize: ISize, viewBoardCoords: IRect, viewportSize: ISize, scale: number): ISize {
		var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);

		return {
			width: realSize.width / k.kx * scale,
			height: realSize.height / k.ky * scale
		};
	}

	public static countNewDragRect(deltaXScreen: number, deltaYScreen: number, viewBoardCoords: IRect, viewportSize: ISize): IRect {
		var realDelta = RenderHelper.countRealDelta({ x: deltaXScreen, y: deltaYScreen }, viewBoardCoords, viewportSize);
		return {
			a: { x: viewBoardCoords.a.x - realDelta.x, y: viewBoardCoords.a.y - realDelta.y },
			b: { x: viewBoardCoords.b.x - realDelta.x, y: viewBoardCoords.b.y - realDelta.y }
		};
	}

	private static countRealDelta(deltaScreen: IPoint, viewBoardCoords: IRect, viewportSize: ISize): IPoint {
		var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);

		return {
			x: deltaScreen.x * k.kx,
			y: deltaScreen.y * k.ky
		};
	}

	public static countNewZoomRect(scaleModifier: number, zoomScreenPoint: IPoint, viewBoardCoords: IRect, viewportSize: ISize): IRect {
		var zoomRealPoint = RenderHelper.countRealCoordinates(zoomScreenPoint, viewBoardCoords, viewportSize);
		var deltaScale = 1 + Math.abs(scaleModifier);
		if (scaleModifier < 0) {
			deltaScale = 1 / deltaScale;
		}

		var deltaXStart = (zoomRealPoint.x - viewBoardCoords.a.x) * (1 - deltaScale);
		var newXStart = viewBoardCoords.a.x + deltaXStart;

		var deltaYStart = (zoomRealPoint.y - viewBoardCoords.a.y) * (1 - deltaScale);
		var newYStart = viewBoardCoords.a.y + deltaYStart;

		var deltaXEnd = (viewBoardCoords.b.x - zoomRealPoint.x) * (1 - deltaScale);
		var newXEnd = viewBoardCoords.b.x - deltaXEnd;

		var deltaYEnd = (viewBoardCoords.b.y - zoomRealPoint.y) * (1 - deltaScale);
		var newYEnd = viewBoardCoords.b.y - deltaYEnd;

		return {
			a: { x: newXStart, y: newYStart },
			b: { x: newXEnd, y: newYEnd }
		};
	}

	private static countRealCoordinates(screenPoint: IPoint, viewBoardCoords: IRect, viewportSize: ISize): IPoint {
		var vpMin = viewBoardCoords.a;
		var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);

		return {
			x: vpMin.x + screenPoint.x * k.kx,
			y: vpMin.y + screenPoint.y * k.ky
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