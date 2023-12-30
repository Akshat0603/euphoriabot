"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const strip_ansi_1 = require("../../utilities/strip-ansi");
const url_embed_proofer_1 = require("../../utilities/url-embed-proofer");
const discord_markdown_1 = require("../../utilities/discord-markdown");
var previousMessage = "[00:00:00]";
var restarting = false;
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
            let chatMessage = args.join(" ");
            if (chatMessage === "Stopping the server") {
                chatMessage = "Server has Stopped!";
                await client.SMPchatWebhook.send({
                    embeds: [new discord_js_1.EmbedBuilder().setTitle(chatMessage).setColor("#FF0000")],
                });
                restarting = true;
                return;
            }
            if (chatMessage === "Preparing start region for dimension minecraft:overworld") {
                chatMessage = "Server has Started!";
                await client.SMPchatWebhook.send({
                    embeds: [new discord_js_1.EmbedBuilder().setTitle(chatMessage).setColor("#00FF00")],
                });
                restarting = false;
                return;
            }
            if (restarting === true)
                return;
            if (chatMessage.endsWith("joined the game")) {
                await client.SMPchatWebhook.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(chatMessage)
                            .setColor("#00FF00")
                            .setThumbnail(`https://minotar.net/cube/${args[0]}.png`),
                    ],
                });
                return;
            }
            if (chatMessage.endsWith("left the game")) {
                await client.SMPchatWebhook.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(chatMessage)
                            .setColor("#FF0000")
                            .setThumbnail(`https://minotar.net/cube/${args[0]}.png`),
                    ],
                });
                return;
            }
            if (args[0].startsWith("<") && args[0].endsWith(">")) {
                args[0] = args[0].replace("<", "");
                const username = args[0].replace(">", "");
                args = args.slice(1);
                chatMessage = args.join(" ");
                chatMessage = (0, url_embed_proofer_1.checkUrlEmbedProof)(chatMessage);
                chatMessage = (0, discord_markdown_1.clearDiscordMarkdown)(chatMessage);
                await client.SMPchatWebhook.send({
                    username: username,
                    avatarURL: `https://minotar.net/cube/${username}.png`,
                    content: chatMessage,
                });
                return;
            }
            if (args[0].startsWith("[") && args[0].endsWith("]")) {
                args = args.slice(1);
                chatMessage = args.join(" ");
                chatMessage = (0, url_embed_proofer_1.checkUrlEmbedProof)(chatMessage);
                chatMessage = (0, discord_markdown_1.clearDiscordMarkdown)(chatMessage);
                await client.SMPchatWebhook.send({ content: chatMessage });
                return;
            }
            if (args.length > 5 &&
                args[1] === "has" &&
                args[2] === "made" &&
                args[3] === "the" &&
                args[4] === "advancement") {
                await client.SMPchatWebhook.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(chatMessage)
                            .setColor("#b700FF")
                            .setThumbnail(`https://minotar.net/cube/${args[0]}.png`),
                    ],
                });
                return;
            }
            if (args.length > 5 &&
                args[1] === "has" &&
                args[2] === "reached" &&
                args[3] === "the" &&
                args[4] === "goal") {
                await client.SMPchatWebhook.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(chatMessage)
                            .setColor("#b700FF")
                            .setThumbnail(`https://minotar.net/cube/${args[0]}.png`),
                    ],
                });
                return;
            }
            await client.SMPchatWebhook.send({
                embeds: [new discord_js_1.EmbedBuilder().setTitle(chatMessage).setColor("#b700FF")],
            });
        }
    },
};
//# sourceMappingURL=server-output.js.map