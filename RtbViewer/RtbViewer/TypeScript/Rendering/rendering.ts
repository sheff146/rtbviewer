module Rendering {
	export var renderers: IRenderer[] = [
		new CanvasRenderer(),
		new DomRenderer()
	];

	export interface IRenderer {
		getType(): string;
		clear(viewport: HTMLElement): void;
		draw(board: IBoard, viewport: HTMLElement, boardRect: IRect): void;
	}

	export interface IDeltaPoint {
		deltaX: number;
		deltaY: number;
	}

	export interface ILayoutParams {
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		textAlign?: string;
		backgroundColor?: string;
		fontSize?: number;
		rotate?: number;
		lineHeightCoeff?: number;
		padding?: number;
	}

	export interface ISize {
		width: number;
		height: number;
	}

	export interface IViewPortParams {
		rect: IRect;
		size: ISize;
	}

	export class LayoutHelper {
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

	export class RenderHelper {
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

		public static countMappingScale(viewportParams: IViewPortParams): { kx: number; ky: number } {
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

		public static countScreenCoords(realCoords: IPoint, viewportParams: IViewPortParams): IPoint {
			var viewportRect = viewportParams.rect;
			var vpMin = viewportRect.a;
			var k = RenderHelper.countMappingScale(viewportParams);

			return {
				x: (realCoords.x - vpMin.x) / k.kx,
				y: (realCoords.y - vpMin.y) / k.ky
			};
		}

		public static countScreenSize(realSize: ISize, viewportParams: IViewPortParams, scale: number): ISize {
			var k = RenderHelper.countMappingScale(viewportParams);

			return {
				width: realSize.width / k.kx * scale,
				height: realSize.height / k.ky * scale
			};
		}

		public static countNewDragRect(deltaScreen: IDeltaPoint, viewportParams: IViewPortParams): IRect {
			var viewportRect = viewportParams.rect;
			var realDelta = RenderHelper.countRealDelta(deltaScreen, viewportParams);
			return {
				a: { x: viewportRect.a.x - realDelta.deltaX, y: viewportRect.a.y - realDelta.deltaY },
				b: { x: viewportRect.b.x - realDelta.deltaX, y: viewportRect.b.y - realDelta.deltaY }
			};
		}

		private static countRealDelta(deltaScreen: IDeltaPoint, viewportParams: IViewPortParams): IDeltaPoint {
			var k = RenderHelper.countMappingScale(viewportParams);

			return {
				deltaX: deltaScreen.deltaX * k.kx,
				deltaY: deltaScreen.deltaY * k.ky
			};
		}

		public static countNewZoomRect(scaleModifier: number, zoomScreenPoint: IPoint, viewportParams: IViewPortParams): IRect {
			var viewportRect = viewportParams.rect;
			var zoomRealPoint = RenderHelper.countRealCoordinates(zoomScreenPoint, viewportParams);
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

		private static countRealCoordinates(screenPoint: IPoint, viewportParams: IViewPortParams): IPoint {
			var viewportRect = viewportParams.rect;
			var vpMin = viewportRect.a;
			var k = RenderHelper.countMappingScale(viewportParams);

			return {
				x: vpMin.x + screenPoint.x * k.kx,
				y: vpMin.y + screenPoint.y * k.ky
			};
		}

		public static hexColorFromNumber(bc: number): string {
			return bc < 0
				? "transparent"
				: "#" + bc.toString(16);
		}

		public static textAlignmentFromString(ta: string): string {
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

	class CanvasRenderer implements IRenderer {
		private _widgetRenderers: IDictionary<CanvasWidgets.ICanvasWidgetRenderer> = {};

		constructor() {
			CanvasWidgets.widgetRenderers.forEach((widgetRenderer: CanvasWidgets.ICanvasWidgetRenderer) => {
				this.addWidgetRenderer(widgetRenderer);
			});
		}

		private addWidgetRenderer(widgetRenderer: CanvasWidgets.ICanvasWidgetRenderer) {
			this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
		}

		public clear(viewport: HTMLElement): void {
			viewport.innerHTML = "";
		}

		public getType(): string {
			return "canvas";
		}

		public draw(board: IBoard, viewport: HTMLElement, viewRect: IRect): void {
			var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
			var viewportParams = { rect: viewRect, size: viewportSize };

			var canvas = <HTMLCanvasElement>document.getElementById(board.idStr);
			if (!canvas) {
				canvas = this.createCanvas(board, viewport);
				viewport.appendChild(canvas);
			}

			// ReSharper disable once RedundantTypeCast
			var context = <CanvasRenderingContext2D>canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			board.widgets.forEach((widget: IWidget) => {
				var renderer = this._widgetRenderers[widget.type];
				if (renderer) {
					context.save();
					renderer.render(widget, context, viewportParams);
					context.restore();
				}
			});
		}

		private createCanvas(board: IBoard, viewport: HTMLElement): HTMLCanvasElement {
			var canvas = document.createElement("canvas");

			canvas.id = board.idStr;
			canvas.style.position = "absolute";
			canvas.style.backgroundColor = "#DDDDDD";
			canvas.style.left = 0 + "px";
			canvas.style.top = 0 + "px";
			canvas.width = viewport.clientWidth;
			canvas.height = viewport.clientHeight;

			return canvas;
		}
	}

	class DomRenderer implements IRenderer {
		private _widgetRenderers: IDictionary<DomWidgets.IDomWidgetRenderer> = {};

		constructor() {
			DomWidgets.widgetRenderers.forEach((widgetRenderer: DomWidgets.IDomWidgetRenderer) => {
				this.addWidgetRenderer(widgetRenderer);
			});
		}

		private addWidgetRenderer(widgetRenderer: DomWidgets.IDomWidgetRenderer) {
			this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
		}

		public clear(viewport: HTMLElement): void {
			viewport.innerHTML = "";
		}

		public getType(): string {
			return "dom";
		}

		public draw(board: IBoard, viewport: HTMLElement, viewRect: IRect): void {
			var viewportSize: ISize = { width: viewport.clientWidth, height: viewport.clientHeight };
			var viewportParams = { rect: viewRect, size: viewportSize };

			var layoutBoard = document.getElementById(board.idStr);
			var layoutExists = true;
			if (!layoutBoard) {
				layoutBoard = this.createLayout(board, viewport);
				layoutExists = false;
			}

			board.widgets.forEach((widget: IWidget) => {
				var renderer = this._widgetRenderers[widget.type];
				if (renderer) {
					renderer.render(widget, layoutBoard, viewportParams);
				}
			});

			if (!layoutExists) {
				viewport.appendChild(layoutBoard);
			}
		}

		private createLayout(board: IBoard, viewport: HTMLElement): HTMLElement {
			var layout = document.createElement("div");

			layout.id = board.idStr;
			layout.style.position = "absolute";
			layout.style.backgroundColor = "#DDDDDD";
			layout.style.left = 0 + "px";
			layout.style.top = 0 + "px";
			layout.style.width = "100%";
			layout.style.height = "100%";

			return layout;
		}
	}
}