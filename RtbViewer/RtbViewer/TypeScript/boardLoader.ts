class BoardLoader {
	public loadBoard(boardId: string, callback: (board: IBoard) => any): void {
		// ReSharper disable once InconsistentNaming
		var request = new XMLHttpRequest();
		request.open("GET", "//api.realtimeboard.com/objects/" + boardId, true);
		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = request.responseText;
					var board = JSON.parse(response);

					callback.call(null, board);
				} else {
					throw new Error("Ошибка загрузки данных");
				}
			}
		};
		request.send();
	}
} 