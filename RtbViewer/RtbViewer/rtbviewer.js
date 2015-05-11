var CanvasRenderer = (function () {
    function CanvasRenderer() {
        this.addWidgetRenderer(new StickerCanvasRenderer());
        this.addWidgetRenderer(new ImageCanvasRenderer());
        this.addWidgetRenderer(new TextCanvasRenderer());
    }
    CanvasRenderer.prototype.addWidgetRenderer = function (widgetRenderer) {
        this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
    };
    CanvasRenderer.prototype.clear = function (viewport) {
        viewport.innerHTML = "";
    };
    CanvasRenderer.prototype.getType = function () {
        return "canvas";
    };
    CanvasRenderer.prototype.draw = function (board, viewport, viewRect) {
        var _this = this;
        var canvas = this.createCanvas(board, viewport);
        var viewportSize = { width: viewport.clientWidth, height: viewport.clientHeight };
        viewport.appendChild(canvas);
        board.widgets.forEach(function (widget) {
            var renderer = _this._widgetRenderers[widget.type];
            if (renderer) {
                renderer.render(widget, canvas, viewRect, viewportSize);
            }
        });
    };
    CanvasRenderer.prototype.createCanvas = function (board, viewport) {
        var layout = document.createElement("canvas");
        layout.id = board.idStr;
        layout.style.position = "absolute";
        layout.style.backgroundColor = "#DDDDDD";
        layout.style.left = 0 + "px";
        layout.style.top = 0 + "px";
        layout.style.width = viewport.clientWidth + "px";
        layout.style.height = viewport.clientHeight + "px";
        return layout;
    };
    return CanvasRenderer;
})();
var ImageCanvasRenderer = (function () {
    function ImageCanvasRenderer() {
    }
    ImageCanvasRenderer.prototype.getWidgetType = function () {
        return 1;
    };
    ImageCanvasRenderer.prototype.render = function (widget, layoutCanvas, viewBoardCoords, viewportSize) {
    };
    return ImageCanvasRenderer;
})();
var StickerCanvasRenderer = (function () {
    function StickerCanvasRenderer() {
    }
    StickerCanvasRenderer.prototype.getWidgetType = function () {
        return 5;
    };
    StickerCanvasRenderer.prototype.render = function (widget, layoutCanvas, viewBoardCoords, viewportSize) {
    };
    return StickerCanvasRenderer;
})();
var TextCanvasRenderer = (function () {
    function TextCanvasRenderer() {
    }
    TextCanvasRenderer.prototype.getWidgetType = function () {
        return 4;
    };
    TextCanvasRenderer.prototype.render = function (widget, layoutCanvas, viewBoardCoords, viewportSize) {
    };
    return TextCanvasRenderer;
})();
var DomWidgetHelper = (function () {
    function DomWidgetHelper() {
    }
    DomWidgetHelper.createDiv = function (widget, viewBoardCoords, viewportSize) {
        var element = document.createElement("div");
        DomWidgetHelper.setWidgetLayout(element, widget, viewBoardCoords, viewportSize);
        return element;
    };
    DomWidgetHelper.setWidgetLayout = function (element, widget, viewBoardCoords, viewportSize) {
        var widgetRealCoords = { x: widget.x, y: widget.y };
        var widgetScreenCoords = RenderHelper.countScreenCoords(widgetRealCoords, viewBoardCoords, viewportSize);
        element.style.left = widgetScreenCoords.x + "px";
        element.style.top = widgetScreenCoords.y + "px";
        element.style.transform = DomWidgetHelper.createTransformString(widget);
        element.style.position = "absolute";
        element.id = widget.idStr;
    };
    DomWidgetHelper.createTransformString = function (widget) {
        var angle = widget.angle || 0;
        var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
        return StringFormatter.format(transformBlank, angle);
    };
    DomWidgetHelper.createImage = function (imgSrc, viewBoardCoords, viewportSize, scale) {
        var image = document.createElement("img");
        image.onload = function () {
            var realSize = { width: image.width, height: image.height };
            var screenSize = RenderHelper.countScreenSize(realSize, viewBoardCoords, viewportSize, scale);
            image.width = screenSize.width;
            image.height = screenSize.height;
        };
        image.src = imgSrc;
        return image;
    };
    return DomWidgetHelper;
})();
var DomRenderer = (function () {
    function DomRenderer() {
        this._widgetRenderers = {};
        this.addWidgetRenderer(new StickerDomRenderer());
        this.addWidgetRenderer(new ImageDomRenderer());
        this.addWidgetRenderer(new TextDomRenderer());
    }
    DomRenderer.prototype.addWidgetRenderer = function (widgetRenderer) {
        this._widgetRenderers[widgetRenderer.getWidgetType()] = widgetRenderer;
    };
    DomRenderer.prototype.clear = function (viewport) {
        viewport.innerHTML = "";
    };
    DomRenderer.prototype.getType = function () {
        return "dom";
    };
    DomRenderer.prototype.draw = function (board, viewport, viewRect) {
        var _this = this;
        var layoutBoard = this.createLayout(board, viewport);
        var viewportSize = { width: viewport.clientWidth, height: viewport.clientHeight };
        board.widgets.forEach(function (widget) {
            var renderer = _this._widgetRenderers[widget.type];
            if (renderer) {
                renderer.render(widget, layoutBoard, viewRect, viewportSize);
            }
        });
        viewport.appendChild(layoutBoard);
    };
    DomRenderer.prototype.createLayout = function (board, viewport) {
        var layout = document.createElement("div");
        layout.id = board.idStr;
        layout.style.position = "absolute";
        layout.style.backgroundColor = "#DDDDDD";
        layout.style.left = 0 + "px";
        layout.style.top = 0 + "px";
        layout.style.width = "100%";
        layout.style.height = "100%";
        return layout;
    };
    return DomRenderer;
})();
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var viewer;
        var viewport = document.getElementById("viewport");
        var request = new XMLHttpRequest();
        request.open("GET", "//api.realtimeboard.com/objects/74254402", true);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = request.responseText;
                    var board = JSON.parse(response);
                    viewer = new Viewer(board, viewport);
                    viewer.addRenderer(new DomRenderer());
                    viewer.addRenderer(new CanvasRenderer());
                    viewer.render("dom");
                }
                else {
                    throw new Error("Ошибка загрузки данных");
                }
            }
        };
        request.send();
        var radioDom = document.getElementById("dom-renderer-switch");
        var radioCanvas = document.getElementById("canvas-renderer-switch");
        var switchHandler = function (ev) {
            var radio = ev.target;
            var renderType = radio.value;
            viewer.render(renderType);
        };
        radioDom.addEventListener("click", switchHandler);
        radioCanvas.addEventListener("click", switchHandler);
        var btnZoomIn = document.getElementById("zoom-in");
        var btnZoomOut = document.getElementById("zoom-out");
        var zoomHandler = function (ev) {
            var curTarget = ev.currentTarget;
            var zoomMultiplier = 0;
            var zoomPoint = { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
            switch (curTarget.id) {
                case "zoom-in":
                    zoomMultiplier = -0.1;
                    break;
                case "zoom-out":
                    zoomMultiplier = 0.1;
                    break;
                case "viewport":
                    zoomMultiplier = ev.deltaY > 0 ? 0.1 : -0.1;
                    zoomPoint.x = ev.x;
                    zoomPoint.y = ev.y;
                    break;
            }
            viewer.zoom(zoomMultiplier, zoomPoint);
        };
        btnZoomIn.addEventListener("click", zoomHandler);
        btnZoomOut.addEventListener("click", zoomHandler);
        viewport.addEventListener("wheel", zoomHandler);
        var mousePosition = { x: 0, y: 0 };
        var isPressed = false;
        viewport.addEventListener("mousedown", function (ev) {
            isPressed = true;
            mousePosition.x = ev.x;
            mousePosition.y = ev.y;
        });
        viewport.addEventListener("mouseup", function (ev) {
            isPressed = false;
        });
        viewport.addEventListener("mousemove", function (ev) {
            if (isPressed) {
                var deltaX = ev.x - mousePosition.x;
                var deltaY = ev.y - mousePosition.y;
                mousePosition.x = ev.x;
                mousePosition.y = ev.y;
                viewer.move(deltaX, deltaY);
            }
        });
    });
})();
var ImageDomRenderer = (function () {
    function ImageDomRenderer() {
    }
    ImageDomRenderer.prototype.getWidgetType = function () {
        return 1;
    };
    ImageDomRenderer.prototype.render = function (widget, layoutBoard, viewBoardCoords, viewportSize) {
        var image = DomWidgetHelper.createImage(widget.url, viewBoardCoords, viewportSize, widget.scale);
        DomWidgetHelper.setWidgetLayout(image, widget, viewBoardCoords, viewportSize);
        layoutBoard.appendChild(image);
    };
    return ImageDomRenderer;
})();
var StickerDomRenderer = (function () {
    function StickerDomRenderer() {
    }
    StickerDomRenderer.prototype.getWidgetType = function () {
        return 5;
    };
    StickerDomRenderer.prototype.render = function (widget, layoutBoard, viewBoardCoords, viewportSize) {
        var sticker = DomWidgetHelper.createDiv(widget, viewBoardCoords, viewportSize);
        var bgImage = DomWidgetHelper.createImage("assets/sticker.png", viewBoardCoords, viewportSize, widget.scale);
        var text = this.createSpan(widget.text);
        sticker.appendChild(bgImage);
        sticker.appendChild(text);
        layoutBoard.appendChild(sticker);
    };
    StickerDomRenderer.prototype.createSpan = function (text) {
        var textElement = document.createElement("span");
        textElement.style.position = "absolute";
        textElement.innerText = text;
        textElement.style.fontSize = "1px";
        return textElement;
    };
    return StickerDomRenderer;
})();
var TextDomRenderer = (function () {
    function TextDomRenderer() {
    }
    TextDomRenderer.prototype.getWidgetType = function () {
        return 4;
    };
    TextDomRenderer.prototype.render = function (widget, layoutBoard, viewBoardCoords, viewportSize) {
        var element = DomWidgetHelper.createDiv(widget, viewBoardCoords, viewportSize);
        var realSize = { width: widget.width, height: 0 };
        var screenSize = RenderHelper.countScreenSize(realSize, viewBoardCoords, viewportSize, widget.scale);
        element.style.width = screenSize.width + "px";
        element.innerHTML = widget.text;
        this.setUpTextStyle(element);
        if (widget.style) {
            if (widget.style.ta) {
                element.style.textAlign = RenderHelper.textAlignmentFromString(widget.style.ta);
            }
            if (widget.style.bc) {
                element.style.backgroundColor = RenderHelper.hexColorFromNumber(widget.style.bc);
            }
        }
        layoutBoard.appendChild(element);
    };
    TextDomRenderer.prototype.setUpTextStyle = function (element) {
        var el = element;
        if (el.style.msUserSelect) {
            el.style.msUserSelect = "none";
        }
        if (el.style.webkitUserSelect) {
            el.style.webkitUserSelect = "none";
        }
        if (el.style.mozUserSelect) {
            el.style.mozUserSelect = "none";
        }
        if (el.style.userSelect) {
            el.style.userSelect = "none";
        }
        element.style.fontSize = "1px";
    };
    return TextDomRenderer;
})();
var StringFormatter = (function () {
    function StringFormatter() {
    }
    StringFormatter.format = function (format) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        var str = format;
        if (!elements.length)
            return str;
        for (var arg in elements)
            if (elements.hasOwnProperty(arg)) {
                str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), elements[arg]);
            }
        return str;
    };
    return StringFormatter;
})();
var RenderHelper = (function () {
    function RenderHelper() {
    }
    RenderHelper.countViewBoardCoords = function (startPosotion, viewportSize) {
        var rMin = startPosotion.a;
        var rMax = startPosotion.b;
        var vpWidth = viewportSize.width;
        var vpHeight = viewportSize.height;
        var ky = (rMax.y - rMin.y) / vpHeight;
        var freeSpace = (vpWidth * ky - (rMax.x - rMin.x)) / 2;
        var xMinBoard = rMin.x - freeSpace;
        var xMaxBoard = rMax.x + freeSpace;
        return { a: { x: xMinBoard, y: rMin.y }, b: { x: xMaxBoard, y: rMax.y } };
    };
    RenderHelper.countMappingScale = function (viewBoardCoords, viewportSize) {
        var vpMin = viewBoardCoords.a;
        var vpMax = viewBoardCoords.b;
        var vpWidth = viewportSize.width;
        var vpHeight = viewportSize.height;
        var kx = (vpMax.x - vpMin.x) / vpWidth;
        var ky = (vpMax.y - vpMin.y) / vpHeight;
        return { kx: kx, ky: ky };
    };
    RenderHelper.countScreenCoords = function (realCoords, viewBoardCoords, viewportSize) {
        var vpMin = viewBoardCoords.a;
        var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);
        return {
            x: (realCoords.x - vpMin.x) / k.kx,
            y: (realCoords.y - vpMin.y) / k.ky
        };
    };
    RenderHelper.countScreenSize = function (realSize, viewBoardCoords, viewportSize, scale) {
        var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);
        return {
            width: realSize.width / k.kx * scale,
            height: realSize.height / k.ky * scale
        };
    };
    RenderHelper.countNewDragRect = function (deltaXScreen, deltaYScreen, viewBoardCoords, viewportSize) {
        var realDelta = RenderHelper.countRealDelta({ x: deltaXScreen, y: deltaYScreen }, viewBoardCoords, viewportSize);
        return {
            a: { x: viewBoardCoords.a.x - realDelta.x, y: viewBoardCoords.a.y - realDelta.y },
            b: { x: viewBoardCoords.b.x - realDelta.x, y: viewBoardCoords.b.y - realDelta.y }
        };
    };
    RenderHelper.countRealDelta = function (deltaScreen, viewBoardCoords, viewportSize) {
        var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);
        return {
            x: deltaScreen.x * k.kx,
            y: deltaScreen.y * k.ky
        };
    };
    RenderHelper.countNewZoomRect = function (scaleModifier, zoomScreenPoint, viewBoardCoords, viewportSize) {
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
    };
    RenderHelper.countRealCoordinates = function (screenPoint, viewBoardCoords, viewportSize) {
        var vpMin = viewBoardCoords.a;
        var k = RenderHelper.countMappingScale(viewBoardCoords, viewportSize);
        return {
            x: vpMin.x + screenPoint.x * k.kx,
            y: vpMin.y + screenPoint.y * k.ky
        };
    };
    RenderHelper.hexColorFromNumber = function (bc) {
        return "#" + bc.toString(16);
    };
    RenderHelper.textAlignmentFromString = function (ta) {
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
    };
    return RenderHelper;
})();
var Viewer = (function () {
    function Viewer(board, viewport) {
        this._board = board;
        this._viewport = viewport;
        this._rendererCollection = {};
        var jsonPosition = JSON.stringify(board.startPosition);
        var viewRect = JSON.parse(jsonPosition);
        var viewportSize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
        this._viewRect = RenderHelper.countViewBoardCoords(viewRect, viewportSize);
    }
    Viewer.prototype.addRenderer = function (renderer) {
        var renderType = renderer.getType();
        this._rendererCollection[renderType] = renderer;
    };
    Viewer.prototype.render = function (renderType) {
        var newRenderer = this._rendererCollection[renderType];
        if (!newRenderer) {
            throw new TypeError("Не найден тип рендера: " + renderType);
        }
        if (newRenderer !== this._renderer) {
            if (this._renderer) {
                this._renderer.clear(this._viewport);
            }
            this._renderer = newRenderer;
            this._renderer.draw(this._board, this._viewport, this._viewRect);
        }
    };
    Viewer.prototype.zoom = function (scaleModifier, zoomPoint) {
        var viewportSize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
        this._viewRect = RenderHelper.countNewZoomRect(scaleModifier, zoomPoint, this._viewRect, viewportSize);
        this._renderer.clear(this._viewport);
        this._renderer.draw(this._board, this._viewport, this._viewRect);
    };
    Viewer.prototype.move = function (deltaX, deltaY) {
        var viewportSize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
        this._viewRect = RenderHelper.countNewDragRect(deltaX, deltaY, this._viewRect, viewportSize);
        this._renderer.clear(this._viewport);
        this._renderer.draw(this._board, this._viewport, this._viewRect);
    };
    return Viewer;
})();
