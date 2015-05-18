module Rendering {
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

	export var renderers: IRenderer[] = [
		new CanvasRenderer(),
		new DomRenderer()
	];
}