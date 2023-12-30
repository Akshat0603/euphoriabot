"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const strip_ansi_1 = require("../../utilities/strip-ansi");
const console_1 = require("console");
var previousMessage = "[00:00:00]";
var restarting = false;
var channel = undefined;
async function sendMessage(client, message) {
    if (!channel) {
        const c = await client.channels.cache.get(client.channelCMPchatID);
        if (c && c.type === discord_js_1.ChannelType.GuildText) {
            channel = c;
        }
        else
            throw new console_1.error();
    }
    await channel.send(message);
}
exports.event = {
    name: "serverOutput",
    execute: async (client, consoleMessage) => {
        let message = (0, strip_ansi_1.stripANSIEscapeCodes)(consoleMessage);
        let args = previousMessage.split(" ");
        const time = /\[\d{2}:\d{2}:\d{2}\]/;
        if (!time.test(previousMessage) && args.length > 0) {
            if ((args[0] === "say" && args.length > 1) || args[0] === "stop") {
            }
            else {
                previousMessage = message;
                return;
            }
        }
        previousMessage = message;
        args = message.split(" ");
        if (args.length > 4 &&
            time.test(args[0]) &&
            args[1] === "[Server" &&
            args[2] === "thread/INFO]" &&
            args[3] === "[minecraft/MinecraftServer]:") {
            args = args.slice(4);
            if ((args[0].startsWith("<") && args[0].endsWith(">")) ||
                (args[0].startsWith("[") && args[0].endsWith("]"))) {
                args[0] = "**" + args[0] + "**";
            }
            let chatMessage = args.join(" ");
            if (chatMessage === "Stopping the server") {
                chatMessage = "## Server has Stopped!";
                sendMessage(client, chatMessage);
                restarting = true;
                return;
            }
            if (chatMessage === "Preparing start region for dimension minecraft:overworld") {
                chatMessage = "## Server has Started!";
                sendMessage(client, chatMessage);
                restarting = false;
                return;
            }
            if (restarting === true)
                return;
            if (chatMessage.endsWith("joined the game") || chatMessage.endsWith("left the game")) {
                chatMessage = "**" + chatMessage + "**";
            }
            chatMessage = chatMessage.replaceAll("_", "\\_");
            sendMessage(client, chatMessage);
        }
    },
};
//# sourceMappingURL=server-output.js.map