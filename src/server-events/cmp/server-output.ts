import { EmbedBuilder, TextChannel } from "discord.js";
import myClient from "../../client";
import { serverEventsType } from "../../types/server-events";
import { stripANSIEscapeCodes } from "../../utilities/strip-ansi";
import { checkUrlEmbedProof } from "../../utilities/url-embed-proofer";
import { clearDiscordMarkdown } from "../../utilities/discord-markdown";

var previousMessage: string = "[00:00:00]";
var restarting: boolean = false;

export const event: serverEventsType = {
	name: "serverOutput",
	execute: async (client: myClient, consoleMessage: string) => {
		// doing prechecks and assigning
		let message = stripANSIEscapeCodes(consoleMessage);
		let args = previousMessage.split(" ");
		const time = /\[\d{2}:\d{2}:\d{2}\]/;

		// checking if this is a command response
		if (!time.test(previousMessage) && args.length > 0) {
			if ((args[0] === "say" && args.length > 1) || args[0] === "stop") {
			} else {
				previousMessage = message;
				return;
			}
		}

		previousMessage = message;

		// Proper Execution
		args = message.split(" ");
		if (
			args.length > 4 &&
			time.test(args[0]) &&
			args[1] === "[Server" &&
			args[2] === "thread/INFO]" &&
			args[3] === "[minecraft/MinecraftServer]:"
		) {
			// EDITING CHAT MESSAGE
			args = args.slice(4);
			let chatMessage = args.join(" ");

			// Server stop
			if (chatMessage === "Stopping the server") {
				chatMessage = "Server has Stopped!";
				await client.CMPchatWebhook.send({
					embeds: [new EmbedBuilder().setTitle(chatMessage).setColor("#FF0000")],
				});
				restarting = true;
				return;
			}

			// Server Start
			if (chatMessage === "Preparing start region for dimension minecraft:overworld") {
				chatMessage = "Server has Started!";
				await client.CMPchatWebhook.send({
					embeds: [new EmbedBuilder().setTitle(chatMessage).setColor("#00FF00")],
				});
				restarting = false;
				return;
			}

			// Return if server is restarting
			if (restarting === true) return;

			// Player join/leave
			if (chatMessage.endsWith("joined the game")) {
				chatMessage = chatMessage.replaceAll("_", "\\_");
				await client.CMPchatWebhook.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(chatMessage)
							.setColor("#00FF00")
							.setThumbnail(`https://minotar.net/avatar/${args[0]}.png`),
					],
				});
				return;
			}
			if (chatMessage.endsWith("left the game")) {
				chatMessage = chatMessage.replaceAll("_", "\\_");
				await client.CMPchatWebhook.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(chatMessage)
							.setColor("#FF0000")
							.setThumbnail(`https://minotar.net/avatar/${args[0]}.png`),
					],
				});
				return;
			}

			// Player Message
			if (args[0].startsWith("<") && args[0].endsWith(">")) {
				args[0] = args[0].replace("<", "");
				const username = args[0].replace(">", "");
				args = args.slice(1);
				chatMessage = args.join(" ");
				chatMessage = checkUrlEmbedProof(chatMessage);
				chatMessage = clearDiscordMarkdown(chatMessage);

				await client.CMPchatWebhook.send({
					username: username,
					avatarURL: `https://minotar.net/avatar/${username}.png`,
					content: chatMessage,
				});

				return;
			}

			// Server Message
			if (args[0].startsWith("[") && args[0].endsWith("]")) {
				args = args.slice(1);
				chatMessage = args.join(" ");
				chatMessage = checkUrlEmbedProof(chatMessage);
				chatMessage = clearDiscordMarkdown(chatMessage);

				await client.CMPchatWebhook.send({ content: chatMessage });

				return;
			}

			// Advancement Message
			if (
				args.length > 5 &&
				args[1] === "has" &&
				args[2] === "made" &&
				args[3] === "the" &&
				args[4] === "advancement"
			) {
				await client.CMPchatWebhook.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(chatMessage)
							.setColor("#b700FF")
							.setThumbnail(`https://minotar.net/avatar/${args[0]}.png`),
					],
				});
				return;
			}

			// Goal Message
			if (
				args.length > 5 &&
				args[1] === "has" &&
				args[2] === "reached" &&
				args[3] === "the" &&
				args[4] === "goal"
			) {
				await client.CMPchatWebhook.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(chatMessage)
							.setColor("#b700FF")
							.setThumbnail(`https://minotar.net/avatar/${args[0]}.png`),
					],
				});
				return;
			}

			// anything else
			await client.CMPchatWebhook.send({
				embeds: [new EmbedBuilder().setTitle(chatMessage).setColor("#b700FF")],
			});
		}
	},
};
