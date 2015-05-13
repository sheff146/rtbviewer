class ImageDomRenderer implements IDomWidgetRenderer {
	public getWidgetType(): number {
		return 1;
	}

	public render(widget: IWidget, layoutBoard: HTMLElement, viewportParams: IViewPortParams): void {
		var layout = LayoutHelper.countWidgetLayout(widget, viewportParams);
		var image = <HTMLImageElement>document.getElementById(widget.idStr);
		var imageExists = true;
		if (!image) {
			imageExists = false;
			image = document.createElement("img");
			image.ondragstart = () => { return false; };

			image.onload = () => {
				this.setImageSize(image, widget, viewportParams);
			};

			image.src = widget.url;
			image.id = widget.idStr;
		} else {
			this.setImageSize(image, widget, viewportParams);
		}

		DomWidgetHelper.setWidgetLayout(image, layout);

		if (!imageExists) {
			layoutBoard.appendChild(image);
		}
	}

	private setImageSize(image: HTMLImageElement, widget: IWidget, viewportParams: IViewPortParams): void {
		var realSize = { width: image.naturalWidth, height: image.naturalHeight };
		var screenSize = RenderHelper.countScreenSize(realSize, viewportParams, widget.scale);

		image.width = screenSize.width;
		image.height = screenSize.height;
	}
}