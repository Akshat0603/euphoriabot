"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripANSIEscapeCodes = void 0;
function stripANSIEscapeCodes(input) {
    const ansiEscapeCodeRegex = /\x1B\[([0-9;]*[mK])/g;
    const cleanedString = input.replace(ansiEscapeCodeRegex, "");
    return cleanedString;
}
exports.stripANSIEscapeCodes = stripANSIEscapeCodes;
//# sourceMappingURL=strip-ansi.js.map