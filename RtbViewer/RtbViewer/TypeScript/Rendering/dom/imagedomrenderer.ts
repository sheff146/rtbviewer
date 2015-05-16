class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var layout: ILayoutParams;
		var image = <HTMLImageElement>document.getElementById(widget.idStr);

		if (!image) {
			image = document.createElement("img");
			image.ondragstart = () => { return false; };

			image.onload = () => {
				layout = this.countImageLayout(image, widget, viewportParams);
				DomWidgetHelper.setWidgetLayout(image, layout);
				layoutBoard.appendChild(image);
			};

			image.src = widget.url;
			image.id = widget.idStr;
		} else {
			layout = this.countImageLayout(image, widget, viewportParams);
			DomWidgetHelper.setWidgetLayout(image, layout);
		}
	}

	private countImageLayout(image: HTMLImageElement, widget: IWidget, viewportParams: IViewPortParams): ILayoutParams {
		var realSize = { width: image.naturalWidth, height: image.naturalHeight };
		return LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
	}
}