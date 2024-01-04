import { readdirSync } from "fs";
import { join } from "path";

/**
 *
 * @param dir The directory to read for files.
 * @param subDirs The number of sub-directories to read for files. Default: 0
 *
 */

export function getAllFiles(dir: string, subDirs?: number): string[] {
	if (!subDirs || subDirs < 0) subDirs = 0;
	var fileNames: string[] = new Array();
	const files = readdirSync(dir, { withFileTypes: true });

	for (const file of files) {
		const fileName = join(file.path, file.name);
		if (file.isDirectory() && subDirs > 0) {
			const dirFiles = getAllFiles(fileName, subDirs - 1);
			for (const dirFile of dirFiles) {
				fileNames.push(dirFile);
			}
		} else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
			fileNames.push(fileName);
		}
	}
	return fileNames;
}
