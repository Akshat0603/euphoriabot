"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function getAllFiles(dir) {
    var fileNames = new Array();
    const files = (0, fs_1.readdirSync)(dir, { withFileTypes: true });
    for (const file of files) {
        const fileName = (0, path_1.join)(file.path, file.name);
        if (file.isDirectory()) {
            const dirFiles = getAllFiles(fileName);
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
exports.default = getAllFiles;
//# sourceMappingURL=getAllFiles.js.map