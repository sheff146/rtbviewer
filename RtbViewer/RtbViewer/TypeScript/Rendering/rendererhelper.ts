interface ISize {
	width: number;
	height: number;
}

class RenderHelper {
	public static countViewportRect(startPosotion: IRect, viewportSize: ISize): IRect {
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

	public static countMappingScale(viewportRect: IRect, viewportSize: ISize): { kx: number; ky: number } {
		var vpMin = viewportRect.a;
		var vpMax = viewportRect.b;
		var vpWidth = viewportSize.width;
		var vpHeight = viewportSize.height;

		var kx = (vpMax.x - vpMin.x) / vpWidth;
		var ky = (vpMax.y - vpMin.y) / vpHeight;

		return { kx: kx, ky: ky };
	}

	public static countScreenCoords(realCoords: IPoint, viewportRect: IRect, viewportSize: ISize): IPoint {
		var vpMin = viewportRect.a;
		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);

		return {
			x: (realCoords.x - vpMin.x) / k.kx,
			y: (realCoords.y - vpMin.y) / k.ky
		};
	}

	public static countScreenSize(realSize: ISize, viewportRect: IRect, viewportSize: ISize, scale: number): ISize {
		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);

		return {
			width: realSize.width / k.kx * scale,
			height: realSize.height / k.ky * scale
		};
	}

	public static countNewDragRect(deltaXScreen: number, deltaYScreen: number, viewportRect: IRect, viewportSize: ISize): IRect {
		var realDelta = RenderHelper.countRealDelta({ x: deltaXScreen, y: deltaYScreen }, viewportRect, viewportSize);
		return {
			a: { x: viewportRect.a.x - realDelta.x, y: viewportRect.a.y - realDelta.y },
			b: { x: viewportRect.b.x - realDelta.x, y: viewportRect.b.y - realDelta.y }
		};
	}

	private static countRealDelta(deltaScreen: IPoint, viewportRect: IRect, viewportSize: ISize): IPoint {
		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);

		return {
			x: deltaScreen.x * k.kx,
			y: deltaScreen.y * k.ky
		};
	}

	public static countNewZoomRect(scaleModifier: number, zoomScreenPoint: IPoint, viewportRect: IRect, viewportSize: ISize): IRect {
		var zoomRealPoint = RenderHelper.countRealCoordinates(zoomScreenPoint, viewportRect, viewportSize);
		var deltaScale = 1 + Math.abs(scaleModifier);
		if (scaleModifier < 0) {
			deltaScale = 1 / deltaScale;
		}

		var deltaXStart = (zoomRealPoint.x - viewportRect.a.x) * (1 - deltaScale);
		var newXStart = viewportRect.a.x + deltaXStart;

		var deltaYStart = (zoomRealPoint.y - viewportRect.a.y) * (1 - deltaScale);
		var newYStart = viewportRect.a.y + deltaYStart;

		var deltaXEnd = (viewportRect.b.x - zoomRealPoint.x) * (1 - deltaScale);
		var newXEnd = viewportRect.b.x - deltaXEnd;

		var deltaYEnd = (viewportRect.b.y - zoomRealPoint.y) * (1 - deltaScale);
		var newYEnd = viewportRect.b.y - deltaYEnd;

		return {
			a: { x: newXStart, y: newYStart },
			b: { x: newXEnd, y: newYEnd }
		};
	}

	private static countRealCoordinates(screenPoint: IPoint, viewportRect: IRect, viewportSize: ISize): IPoint {
		var vpMin = viewportRect.a;
		var k = RenderHelper.countMappingScale(viewportRect, viewportSize);

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