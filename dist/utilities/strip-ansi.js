"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripANSIEscapeCodes = void 0;
function stripANSIEscapeCodes(input) {
    // This regular expression matches ANSI escape codes
    const ansiEscapeCodeRegex = /\x1B\[([0-9;]*[mK])/g;
    // Replace ANSI escape codes with an empty string
    const cleanedString = input.replace(ansiEscapeCodeRegex, "");
    return cleanedString;
}
exports.stripANSIEscapeCodes = stripANSIEscapeCodes;
//# sourceMappingURL=strip-ansi.js.map