export function checkUrlEmbedProof(arg: string): string {
	let newArg = arg;
	const regex = /(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/i;

	const URLs = regex.exec(arg);

	if (URLs) {
		URLs.forEach((url) => {
			if (!url.endsWith(">")) {
				newArg = newArg.replaceAll(url, "<" + url + ">");
			} else newArg = newArg.replaceAll(url, "<" + url);
		});
	}
	return newArg;
}
