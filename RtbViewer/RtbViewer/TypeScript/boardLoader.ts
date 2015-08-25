class BoardLoader {
	public loadBoard(boardId: string, callback: (board: IBoard) => any): void {
		// ReSharper disable once InconsistentNaming
		var request = new XMLHttpRequest();
		var url = `/Content/${boardId}.json`;
		request.open("GET", url, true);
		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = request.responseText;
					var board = JSON.parse(response);
					this.prepareBoard(board);

					callback.call(null, board);
				} else {
					throw new Error("Ошибка загрузки данных");
				}
			}
		};
		request.send();
	}

	private prepareBoard(board: IBoard): void {
		var widgets = board.widgets;
		for (var i = 0; i < widgets.length; i++) {
			var widget = widgets[i];
			if (widget.type === 4) {
				//по стандарту пустой абзац игнорится, а нам надо, чтоб была пустая строка. Костыляем
				widget.text = widget.text.replace(/><\/FONT>/, ">&nbsp;</FONT>");
			}

		}
	}
}