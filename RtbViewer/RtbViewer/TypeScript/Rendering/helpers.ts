module Helpers {
	export class RenderHelper {
		public countViewportRect(startPosotion: IRect, viewportSize: Rendering.ISize): IRect {
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

		public countMappingScale(viewportParams: Rendering.IViewPortParams): { kx: number; ky: number } {
			var viewportRect = viewportParams.rect;
			var viewportSize = viewportParams.size;
			var vpMin = viewportRect.a;
			var vpMax = viewportRect.b;
			var vpWidth = viewportSize.width;
			var vpHeight = viewportSize.height;

			var kx = (vpMax.x - vpMin.x) / vpWidth;
			var ky = (vpMax.y - vpMin.y) / vpHeight;

			return { kx: kx, ky: ky };
		}

		public countScreenCoords(realCoords: IPoint, viewportParams: Rendering.IViewPortParams): IPoint {
			var viewportRect = viewportParams.rect;
			var vpMin = viewportRect.a;
			var k = this.countMappingScale(viewportParams);

			return {
				x: (realCoords.x - vpMin.x) / k.kx,
				y: (realCoords.y - vpMin.y) / k.ky
			};
		}

		public countScreenSize(realSize: Rendering.ISize, viewportParams: Rendering.IViewPortParams, scale: number): Rendering.ISize {
			var k = this.countMappingScale(viewportParams);

			return {
				width: realSize.width / k.kx * scale,
				height: realSize.height / k.ky * scale
			};
		}

		public countNewDragRect(deltaScreen: Rendering.IDeltaPoint, viewportParams: Rendering.IViewPortParams): IRect {
			var viewportRect = viewportParams.rect;
			var realDelta = this.countRealDelta(deltaScreen, viewportParams);
			return {
				a: { x: viewportRect.a.x - realDelta.deltaX, y: viewportRect.a.y - realDelta.deltaY },
				b: { x: viewportRect.b.x - realDelta.deltaX, y: viewportRect.b.y - realDelta.deltaY }
			};
		}

		private countRealDelta(deltaScreen: Rendering.IDeltaPoint, viewportParams: Rendering.IViewPortParams): Rendering.IDeltaPoint {
			var k = this.countMappingScale(viewportParams);

			return {
				deltaX: deltaScreen.deltaX * k.kx,
				deltaY: deltaScreen.deltaY * k.ky
			};
		}

		public countNewZoomRect(scaleModifier: number, zoomScreenPoint: IPoint, viewportParams: Rendering.IViewPortParams): IRect {
			var viewportRect = viewportParams.rect;
			var zoomRealPoint = this.countRealCoordinates(zoomScreenPoint, viewportParams);
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

		private countRealCoordinates(screenPoint: IPoint, viewportParams: Rendering.IViewPortParams): IPoint {
			var viewportRect = viewportParams.rect;
			var vpMin = viewportRect.a;
			var k = this.countMappingScale(viewportParams);

			return {
				x: vpMin.x + screenPoint.x * k.kx,
				y: vpMin.y + screenPoint.y * k.ky
			};
		}

		public hexColorFromNumber(bc: number): string {
			return bc < 0
				? "transparent"
				: "#" + bc.toString(16);
		}

		public textAlignmentFromString(ta: string): string {
			switch (ta) {
				case "c":
					return "center";
				case "r":
					return "right";
				case "l":
				default:
					return "left";
			}
		}
	}

	export class LayoutHelper {
		private _renderHelper: RenderHelper;

		constructor(renderHelper: RenderHelper) {
			this._renderHelper = renderHelper;
		}

		public countWidgetLayout(widget: IWidget, viewportParams: Rendering.IViewPortParams, widgetRealSize: Rendering.ISize = { width: 0, height: 0 }): Rendering.ILayoutParams {
			var layout: Rendering.ILayoutParams = {};
			var widgetRealCoords = { x: widget.x, y: widget.y };
			var widgetScreenCoords = this._renderHelper.countScreenCoords(widgetRealCoords, viewportParams);
			var widgetScreenSize = this._renderHelper.countScreenSize(widgetRealSize, viewportParams, widget.scale);

			layout.width = widgetScreenSize.width;
			layout.height = widgetScreenSize.height;
			layout.x = widgetScreenCoords.x;
			layout.y = widgetScreenCoords.y;
			layout.rotate = widget.angle || 0;

			this.setUpTextParams(widget, layout, viewportParams);

			return layout;
		}

		private setUpTextParams(widget: IWidget, layout: Rendering.ILayoutParams, viewportParams: Rendering.IViewPortParams) {
			var k = this._renderHelper.countMappingScale(viewportParams);

			layout.fontSize = 90 / k.ky;
			layout.lineHeightCoeff = 1.2;

			var ta = widget.style && widget.style.ta ? widget.style.ta : "";
			layout.textAlign = this._renderHelper.textAlignmentFromString(ta);

			var bc = widget.style && widget.style.bc >= 0 ? widget.style.bc : -1;
			layout.backgroundColor = this._renderHelper.hexColorFromNumber(bc);
		}
	}
}