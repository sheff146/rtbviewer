interface IBoard {
	widgets: IWidget[];
	startPosition: IRect;
	idStr: string;
}

interface IWidget {
	width?: number;
	text?: string;
	x: number;
	y: number;
	scale: number;
	"type": number;
	style: IStyle;
	idStr: string;
	angle: number;
	url?: string;
}

interface IStyle {
	ta?: string;
	bc?: number;
}

interface IRect {
	a: IPoint;
	b: IPoint;
}

interface IPoint {
	x: number;
	y: number;
}