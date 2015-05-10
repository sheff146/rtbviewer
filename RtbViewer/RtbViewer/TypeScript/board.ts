interface IBoard {
	widgets: IWidget[];
	startPosition: IPosition;
}

interface IWidget {
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

interface IPosition {
	a: IPoint;
	b: IPoint;
}

interface IPoint {
	x: number;
	y: number;
}