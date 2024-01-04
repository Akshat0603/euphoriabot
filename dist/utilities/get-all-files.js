"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 *
 * @param dir The directory to read for files.
 * @param subDirs The number of sub-directories to read for files. Default: 0
 *
 */
function getAllFiles(dir, subDirs) {
    if (!subDirs || subDirs < 0)
        subDirs = 0;
    var fileNames = new Array();
    const files = (0, fs_1.readdirSync)(dir, { withFileTypes: true });
    for (const file of files) {
        const fileName = (0, path_1.join)(file.path, file.name);
        if (file.isDirectory() && subDirs > 0) {
            const dirFiles = getAllFiles(fileName, subDirs - 1);
            for (const dirFile of dirFiles) {
                fileNames.push(dirFile);
            }
        }
        else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
            fileNames.push(fileName);
        }
    }
    return fileNames;
}
exports.getAllFiles = getAllFiles;
//# sourceMappingURL=get-all-files.js.map