var BoardLoader = (function () {
    function BoardLoader() {
    }
    BoardLoader.prototype.loadBoard = function (boardId, callback) {
        var _this = this;
        // ReSharper disable once InconsistentNaming
        var request = new XMLHttpRequest();
        var url = "/Content/" + boardId + ".json";
        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = request.responseText;
                    var board = JSON.parse(response);
                    _this.prepareBoard(board);
                    callback.call(null, board);
                }
                else {
                    throw new Error("Ошибка загрузки данных");
                }
            }
        };
        request.send();
    };
    BoardLoader.prototype.prepareBoard = function (board) {
        var widgets = board.widgets;
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            if (widget.type === 4) {
                //по стандарту пустой абзац игнорится, а нам надо, чтоб была пустая строка. Костыляем
                widget.text = widget.text.replace(/><\/FONT>/, ">&nbsp;</FONT>");
            }
        }
    };
    return BoardLoader;
})();
var CanvasRenderer = (function () {
    function CanvasRenderer() {
        this._widgetRenderers = {};
        //TODO: фабрику вместо этой хрени
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
        var viewportSize = { width: viewport.clientWidth, height: viewport.clientHeight };
        var viewportParams = { rect: viewRect, size: viewportSize };
        var canvas = document.getElementById(board.idStr);
        if (!canvas) {
            canvas = this.createCanvas(board, viewport);
            viewport.appendChild(canvas);
        }
        // ReSharper disable once RedundantTypeCast
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        board.widgets.forEach(function (widget) {
            var renderer = _this._widgetRenderers[widget.type];
            if (renderer) {
                context.save();
                renderer.render(widget, context, viewportParams);
                context.restore();
            }
        });
    };
    CanvasRenderer.prototype.createCanvas = function (board, viewport) {
        var canvas = document.createElement("canvas");
        canvas.id = board.idStr;
        canvas.style.position = "absolute";
        canvas.style.backgroundColor = "#DDDDDD";
        canvas.style.left = 0 + "px";
        canvas.style.top = 0 + "px";
        canvas.width = viewport.clientWidth;
        canvas.height = viewport.clientHeight;
        return canvas;
    };
    return CanvasRenderer;
})();
var CanvasWidgetHelper = (function () {
    function CanvasWidgetHelper() {
    }
    CanvasWidgetHelper.prepareContextForText = function (context, layout) {
        this.setCommonTransform(context, layout);
        context.textAlign = layout.textAlign ? layout.textAlign : "left";
        var translateX = 0;
        var translateY = -layout.height / 2;
        if (layout.fontSize) {
            context.font = layout.fontSize + "px 'Segoe UI', sans-serif";
            context.textBaseline = "top";
        }
        switch (layout.textAlign) {
            case "center":
                translateX = 0;
                break;
            case "right":
                translateX = layout.width / 2;
                break;
            case "left":
            default:
                translateX = -layout.width / 2;
        }
        context.translate(translateX, translateY);
    };
    CanvasWidgetHelper.setCommonTransform = function (context, layout) {
        var angleRad = (layout.rotate || 0) * Math.PI / 180;
        var delta = CanvasWidgetHelper.countDelta(angleRad, layout);
        context.rotate(angleRad);
        context.translate(delta.deltaX, delta.deltaY);
    };
    CanvasWidgetHelper.prepareContextForBackground = function (context, layout) {
        this.setCommonTransform(context, layout);
        var translateX = -layout.width / 2;
        var translateY = -layout.height / 2;
        context.translate(translateX, translateY);
        context.fillStyle = layout.backgroundColor;
    };
    CanvasWidgetHelper.countDelta = function (angleRad, layout) {
        var xc = layout.x;
        var yc = layout.y;
        var xc1 = xc * Math.cos(angleRad) + yc * Math.sin(angleRad);
        var yc1 = yc * Math.cos(angleRad) - xc * Math.sin(angleRad);
        return { deltaX: xc1 - xc, deltaY: yc1 - yc };
    };
    return CanvasWidgetHelper;
})();
var ImageCanvasRenderer = (function () {
    function ImageCanvasRenderer() {
    }
    ImageCanvasRenderer.prototype.getWidgetType = function () {
        return 1;
    };
    ImageCanvasRenderer.prototype.render = function (widget, context, viewportParams) {
        var _this = this;
        var image = ImageCanvasRenderer.images[widget.idStr];
        if (image) {
            this.renderImage(image, widget, context, viewportParams);
        }
        else {
            image = new Image();
            ImageCanvasRenderer.images[widget.idStr] = image;
            image.onload = function () {
                _this.renderImage(image, widget, context, viewportParams);
            };
            image.src = widget.url;
        }
    };
    ImageCanvasRenderer.prototype.renderImage = function (image, widget, context, viewportParams) {
        var realSize = { width: image.naturalWidth, height: image.naturalHeight };
        var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
        context.save();
        CanvasWidgetHelper.prepareContextForBackground(context, layout);
        context.drawImage(image, layout.x, layout.y, layout.width, layout.height);
        context.restore();
    };
    ImageCanvasRenderer.images = {};
    return ImageCanvasRenderer;
})();
var StickerCanvasRenderer = (function () {
    function StickerCanvasRenderer() {
    }
    StickerCanvasRenderer.prototype.getWidgetType = function () {
        return 5;
    };
    StickerCanvasRenderer.prototype.render = function (widget, context, viewportParams) {
        var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, StickerCanvasRenderer.stickerSize);
        var k = RenderHelper.countMappingScale(viewportParams);
        layout.padding = 15 / k.ky;
        layout.fontSize = 40 / k.ky;
        layout.textAlign = "center";
        if (StickerCanvasRenderer.stickerImage) {
            StickerCanvasRenderer.renderStickerImage(widget, context, layout);
        }
        else {
            StickerCanvasRenderer.stickerImage = new Image();
            StickerCanvasRenderer.stickerImage.onload = function () {
                StickerCanvasRenderer.renderStickerImage(widget, context, layout);
            };
            StickerCanvasRenderer.stickerImage.src = "assets/sticker.png";
        }
        context.save();
        CanvasWidgetHelper.prepareContextForText(context, layout);
        context.fillText(widget.text, layout.x, layout.y + layout.padding, layout.width - 2 * layout.padding);
        context.restore();
    };
    StickerCanvasRenderer.renderStickerImage = function (widget, context, layout) {
        context.save();
        CanvasWidgetHelper.prepareContextForBackground(context, layout);
        context.drawImage(StickerCanvasRenderer.stickerImage, layout.x, layout.y, layout.width, layout.height);
        context.restore();
    };
    StickerCanvasRenderer.stickerSize = { width: 223, height: 235 };
    return StickerCanvasRenderer;
})();
var TextCanvasRenderer = (function () {
    function TextCanvasRenderer() {
    }
    TextCanvasRenderer.prototype.getWidgetType = function () {
        return 4;
    };
    TextCanvasRenderer.prototype.render = function (widget, context, viewportParams) {
        var realSize = { width: widget.width, height: 0 };
        var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
        var cleanText = this.parseInnerText(widget);
        //чтобы рассчитать ширину текста, надо подготовить canvas, но рендерить его надо после фона,
        //поэтому вот так
        context.save();
        CanvasWidgetHelper.prepareContextForText(context, layout);
        var strings = this.wrapText(cleanText, layout, context);
        layout.height = strings.length * layout.fontSize * layout.lineHeightCoeff;
        context.restore();
        context.save();
        CanvasWidgetHelper.prepareContextForBackground(context, layout);
        context.fillRect(layout.x, layout.y, layout.width, layout.height);
        context.restore();
        CanvasWidgetHelper.prepareContextForText(context, layout);
        for (var i = 0; i < strings.length; i++) {
            var marginTop = i * layout.fontSize * layout.lineHeightCoeff;
            context.fillText(strings[i], layout.x, layout.y + marginTop, layout.width);
        }
    };
    TextCanvasRenderer.prototype.parseInnerText = function (widget) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(widget.text, "text/html");
        var paragraphs = doc.getElementsByTagName("p");
        var result = [];
        for (var i = 0; i < paragraphs.length; i++) {
            result.push(paragraphs.item(i).innerText);
        }
        return result;
    };
    TextCanvasRenderer.prototype.wrapText = function (paragraphs, layout, context) {
        var result = [];
        var i;
        for (i = 0; i < paragraphs.length; i++) {
            var paragraphStrings = this.wrapParagraph(paragraphs[i], layout, context);
            result = result.concat(paragraphStrings);
        }
        return result;
    };
    TextCanvasRenderer.prototype.wrapParagraph = function (paragraphText, layout, context) {
        var result = [];
        var currentLine = "";
        var testLine;
        var testWidth;
        var j;
        var maxWidth = Math.ceil(layout.width);
        var words = paragraphText.split(" ");
        if (words.length < 2) {
            return words;
        }
        for (j = 0; j < words.length; j++) {
            testLine = currentLine.length === 0 ? words[j] : currentLine + " " + words[j];
            testWidth = context.measureText(testLine).width;
            if (testWidth < maxWidth) {
                currentLine = testLine;
            }
            else {
                result.push(currentLine);
                currentLine = words[j];
            }
        }
        result.push(currentLine);
        return result;
    };
    return TextCanvasRenderer;
})();
var DomWidgetHelper = (function () {
    function DomWidgetHelper() {
    }
    DomWidgetHelper.setWidgetLayout = function (element, layout) {
        var style = element.style;
        style.position = "absolute";
        style.transform = DomWidgetHelper.createTransformString(layout);
        if (layout.x) {
            style.left = layout.x + "px";
        }
        if (layout.y) {
            style.top = layout.y + "px";
        }
        if (layout.width) {
            style.width = layout.width + "px";
        }
        if (layout.height) {
            style.height = layout.height + "px";
        }
        if (layout.lineHeightCoeff) {
            element.style.lineHeight = layout.lineHeightCoeff.toString();
        }
        if (layout.backgroundColor) {
            element.style.backgroundColor = layout.backgroundColor;
        }
        if (layout.textAlign) {
            element.style.textAlign = layout.textAlign;
        }
        if (layout.fontSize >= 0) {
            element.style.fontSize = layout.fontSize + "px";
        }
        if (layout.padding >= 0) {
            element.style.padding = layout.padding + "px";
        }
    };
    DomWidgetHelper.createTransformString = function (layout) {
        var angle = layout.rotate || 0;
        var transformBlank = "translate(-50%,-50%) rotate({0}deg)";
        return StringFormatter.format(transformBlank, angle);
    };
    return DomWidgetHelper;
})();
var DomRenderer = (function () {
    function DomRenderer() {
        this._widgetRenderers = {};
        //TODO: фабрику вместо этой хрени
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
        var viewportSize = { width: viewport.clientWidth, height: viewport.clientHeight };
        var viewportParams = { rect: viewRect, size: viewportSize };
        var layoutBoard = document.getElementById(board.idStr);
        var layoutExists = true;
        if (!layoutBoard) {
            layoutBoard = this.createLayout(board, viewport);
            layoutExists = false;
        }
        board.widgets.forEach(function (widget) {
            var renderer = _this._widgetRenderers[widget.type];
            if (renderer) {
                renderer.render(widget, layoutBoard, viewportParams);
            }
        });
        if (!layoutExists) {
            viewport.appendChild(layoutBoard);
        }
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
        var loader = new BoardLoader();
        loader.loadBoard("74254402", function (board) {
            viewer = new Viewer(board, viewport);
            viewer.addRenderer(new DomRenderer());
            viewer.addRenderer(new CanvasRenderer());
            viewer.render("dom");
        });
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
        var getCurrentMousePosition = function (ev) {
            var curTarget = ev.currentTarget;
            var x = ev.clientX - curTarget.clientLeft;
            var y = ev.clientY - curTarget.clientTop;
            return { x: x, y: y };
        };
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
                    zoomPoint = getCurrentMousePosition(ev);
                    break;
            }
            viewer.zoom(zoomMultiplier, zoomPoint);
        };
        btnZoomIn.addEventListener("click", zoomHandler);
        btnZoomOut.addEventListener("click", zoomHandler);
        // ReSharper disable once Html.EventNotResolved
        viewport.addEventListener("wheel", zoomHandler);
        var mousePosition = { x: 0, y: 0 };
        var isPressed = false;
        viewport.addEventListener("mousedown", function (ev) {
            isPressed = true;
            mousePosition = getCurrentMousePosition(ev);
        });
        document.addEventListener("mouseup", function (ev) {
            isPressed = false;
        });
        viewport.addEventListener("mousemove", function (ev) {
            if (isPressed) {
                var currentPosition = getCurrentMousePosition(ev);
                var deltaX = currentPosition.x - mousePosition.x;
                var deltaY = currentPosition.y - mousePosition.y;
                mousePosition = currentPosition;
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
    ImageDomRenderer.prototype.render = function (widget, layoutBoard, viewportParams) {
        var _this = this;
        var layout;
        var image = document.getElementById(widget.idStr);
        if (!image) {
            image = document.createElement("img");
            image.ondragstart = function () {
                return false;
            };
            image.onload = function () {
                layout = _this.countImageLayout(image, widget, viewportParams);
                DomWidgetHelper.setWidgetLayout(image, layout);
                layoutBoard.appendChild(image);
            };
            image.src = widget.url;
            image.id = widget.idStr;
        }
        else {
            layout = this.countImageLayout(image, widget, viewportParams);
            DomWidgetHelper.setWidgetLayout(image, layout);
        }
    };
    ImageDomRenderer.prototype.countImageLayout = function (image, widget, viewportParams) {
        var realSize = { width: image.naturalWidth, height: image.naturalHeight };
        return LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
    };
    return ImageDomRenderer;
})();
var StickerDomRenderer = (function () {
    function StickerDomRenderer() {
    }
    StickerDomRenderer.prototype.getWidgetType = function () {
        return 5;
    };
    StickerDomRenderer.prototype.render = function (widget, layoutBoard, viewportParams) {
        var realSize = { width: 223, height: 235 };
        var sticker = document.getElementById(widget.idStr);
        var elementExists = sticker ? true : false;
        if (!sticker) {
            sticker = document.createElement("div");
            sticker.innerText = widget.text;
            sticker.id = widget.idStr;
            sticker.style.backgroundImage = "url(assets/sticker.png)";
            sticker.style.backgroundSize = "100%";
        }
        var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
        var k = RenderHelper.countMappingScale(viewportParams);
        layout.textAlign = "center";
        layout.fontSize = 40 / k.ky;
        layout.padding = 15 / k.ky;
        DomWidgetHelper.setWidgetLayout(sticker, layout);
        if (!elementExists) {
            layoutBoard.appendChild(sticker);
        }
    };
    return StickerDomRenderer;
})();
var TextDomRenderer = (function () {
    function TextDomRenderer() {
    }
    TextDomRenderer.prototype.getWidgetType = function () {
        return 4;
    };
    TextDomRenderer.prototype.render = function (widget, layoutBoard, viewportParams) {
        var realSize = { width: widget.width, height: 0 };
        var layout = LayoutHelper.countWidgetLayout(widget, viewportParams, realSize);
        var element = document.getElementById(widget.idStr);
        var elementExists = element ? true : false;
        if (!element) {
            element = document.createElement("div");
            element.innerHTML = widget.text;
            element.id = widget.idStr;
        }
        DomWidgetHelper.setWidgetLayout(element, layout);
        if (!elementExists) {
            layoutBoard.appendChild(element);
        }
    };
    return TextDomRenderer;
})();
var LayoutHelper = (function () {
    function LayoutHelper() {
    }
    LayoutHelper.countWidgetLayout = function (widget, viewportParams, widgetRealSize) {
        if (widgetRealSize === void 0) { widgetRealSize = { width: 0, height: 0 }; }
        var layout = {};
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
    };
    LayoutHelper.setUpTextParams = function (widget, layout, viewportParams) {
        var k = RenderHelper.countMappingScale(viewportParams);
        layout.fontSize = 90 / k.ky;
        layout.lineHeightCoeff = 1.2;
        var ta = widget.style && widget.style.ta ? widget.style.ta : "";
        layout.textAlign = RenderHelper.textAlignmentFromString(ta);
        var bc = widget.style && widget.style.bc >= 0 ? widget.style.bc : -1;
        layout.backgroundColor = RenderHelper.hexColorFromNumber(bc);
    };
    return LayoutHelper;
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
    RenderHelper.countViewportRect = function (startPosotion, viewportSize) {
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
    RenderHelper.countMappingScale = function (viewportParams) {
        var viewportRect = viewportParams.rect;
        var viewportSize = viewportParams.size;
        var vpMin = viewportRect.a;
        var vpMax = viewportRect.b;
        var vpWidth = viewportSize.width;
        var vpHeight = viewportSize.height;
        var kx = (vpMax.x - vpMin.x) / vpWidth;
        var ky = (vpMax.y - vpMin.y) / vpHeight;
        return { kx: kx, ky: ky };
    };
    RenderHelper.countScreenCoords = function (realCoords, viewportParams) {
        var viewportRect = viewportParams.rect;
        var vpMin = viewportRect.a;
        var k = RenderHelper.countMappingScale(viewportParams);
        return {
            x: (realCoords.x - vpMin.x) / k.kx,
            y: (realCoords.y - vpMin.y) / k.ky
        };
    };
    RenderHelper.countScreenSize = function (realSize, viewportParams, scale) {
        var k = RenderHelper.countMappingScale(viewportParams);
        return {
            width: realSize.width / k.kx * scale,
            height: realSize.height / k.ky * scale
        };
    };
    RenderHelper.countNewDragRect = function (deltaScreen, viewportParams) {
        var viewportRect = viewportParams.rect;
        var realDelta = RenderHelper.countRealDelta(deltaScreen, viewportParams);
        return {
            a: { x: viewportRect.a.x - realDelta.deltaX, y: viewportRect.a.y - realDelta.deltaY },
            b: { x: viewportRect.b.x - realDelta.deltaX, y: viewportRect.b.y - realDelta.deltaY }
        };
    };
    RenderHelper.countRealDelta = function (deltaScreen, viewportParams) {
        var k = RenderHelper.countMappingScale(viewportParams);
        return {
            deltaX: deltaScreen.deltaX * k.kx,
            deltaY: deltaScreen.deltaY * k.ky
        };
    };
    RenderHelper.countNewZoomRect = function (scaleModifier, zoomScreenPoint, viewportParams) {
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
    };
    RenderHelper.countRealCoordinates = function (screenPoint, viewportParams) {
        var viewportRect = viewportParams.rect;
        var vpMin = viewportRect.a;
        var k = RenderHelper.countMappingScale(viewportParams);
        return {
            x: vpMin.x + screenPoint.x * k.kx,
            y: vpMin.y + screenPoint.y * k.ky
        };
    };
    RenderHelper.hexColorFromNumber = function (bc) {
        return bc < 0 ? "transparent" : "#" + bc.toString(16);
    };
    RenderHelper.textAlignmentFromString = function (ta) {
        switch (ta) {
            case "c":
                return "center";
            case "r":
                return "right";
            case "l":
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
        var boardRect = {
            a: {
                x: board.startPosition.a.x,
                y: board.startPosition.a.y
            },
            b: {
                x: board.startPosition.b.x,
                y: board.startPosition.b.y
            }
        };
        var viewportSize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
        this._viewRect = RenderHelper.countViewportRect(boardRect, viewportSize);
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
        var viewportParams = { size: viewportSize, rect: this._viewRect };
        this._viewRect = RenderHelper.countNewZoomRect(scaleModifier, zoomPoint, viewportParams);
        this._renderer.draw(this._board, this._viewport, this._viewRect);
    };
    Viewer.prototype.move = function (deltaX, deltaY) {
        var viewportSize = { width: this._viewport.clientWidth, height: this._viewport.clientHeight };
        var viewportParams = { size: viewportSize, rect: this._viewRect };
        var delta = { deltaX: deltaX, deltaY: deltaY };
        this._viewRect = RenderHelper.countNewDragRect(delta, viewportParams);
        this._renderer.draw(this._board, this._viewport, this._viewRect);
    };
    return Viewer;
})();
//# sourceMappingURL=rtbviewer.js.map