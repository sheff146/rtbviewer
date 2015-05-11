class StringFormatter {
	public static format(format: string, ...elements: any[]): string {
		var str = format;
		if (!elements.length)
			return str;

		for (var arg in elements)
			if (elements.hasOwnProperty(arg)) {
				str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), elements[arg]);
			}

		return str;
	}
}