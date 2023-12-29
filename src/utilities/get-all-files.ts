import { readdirSync } from "fs";
import { join } from "path";

export function getAllFiles(dir: string): string[] {
	var fileNames: string[] = new Array();
	const files = readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		const fileName = join(file.path, file.name);
		if (file.isDirectory()) {
			const dirFiles = getAllFiles(fileName);
			for (const dirFile of dirFiles) {
				fileNames.push(dirFile);
			}
		} else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
			fileNames.push(fileName);
		}
	}
	return fileNames;
}
