"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDiscordMarkdown = void 0;
function clearDiscordMarkdown(message) {
    let newMessage = message;
    newMessage = newMessage.replaceAll("\\", "");
    newMessage = newMessage.replaceAll("*", "\\*");
    newMessage = newMessage.replaceAll("_", "\\_");
    newMessage = newMessage.replaceAll("`", "\\`");
    newMessage = newMessage.replaceAll("*", "\\*");
    newMessage = newMessage.replaceAll("[", "\\[");
    newMessage = newMessage.replaceAll("(", "\\(");
    newMessage = newMessage.replaceAll("#", "\\#");
    newMessage = newMessage.replaceAll(">", "\\>");
    newMessage = newMessage.replaceAll("-", "\\-");
    return newMessage;
}
exports.clearDiscordMarkdown = clearDiscordMarkdown;
//# sourceMappingURL=discord-markdown.js.map