"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUrlEmbedProof = void 0;
function checkUrlEmbedProof(arg) {
    let newArg = arg;
    const regex = /(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/i;
    const URLs = regex.exec(arg);
    if (URLs) {
        URLs.forEach((url) => {
            if (!url.endsWith(">")) {
                newArg = newArg.replaceAll(url, "<" + url + ">");
            }
            else
                newArg = newArg.replaceAll(url, "<" + url);
        });
    }
    return newArg;
}
exports.checkUrlEmbedProof = checkUrlEmbedProof;
//# sourceMappingURL=url-embed-proofer.js.map