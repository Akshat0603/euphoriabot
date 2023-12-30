import { ChannelType, TextChannel } from "discord.js";
import myClient from "../../client";
import { serverEventsType } from "../../types/server-events";
import { stripANSIEscapeCodes } from "../../utilities/strip-ansi";
import { error } from "console";

var previousMessage: string = "[00:00:00]";
var restarting: boolean = false;
var channel: TextChannel | undefined = undefined;

// Send to discord
async function sendMessage(client: myClient, message: string): Promise<void> {
	if (!channel) {
		const c = await client.channels.cache.get(client.channelCMPchatID);
		if (c && c.type === ChannelType.GuildText) {
			channel = c;
		} else throw new error();
	}

	await channel.send(message);
}

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
			if (
				(args[0].startsWith("<") && args[0].endsWith(">")) ||
				(args[0].startsWith("[") && args[0].endsWith("]"))
			) {
				args[0] = "**" + args[0] + "**";
			}
			let chatMessage = args.join(" ");

			// Server stop
			if (chatMessage === "Stopping the server") {
				chatMessage = "## Server has Stopped!";
				sendMessage(client, chatMessage);
				restarting = true;
				return;
			}

			// Server Start
			if (chatMessage === "Preparing start region for dimension minecraft:overworld") {
				chatMessage = "## Server has Started!";
				sendMessage(client, chatMessage);
				restarting = false;
				return;
			}

			// Return if server is restarting
			if (restarting === true) return;

			// Player join/leave
			if (chatMessage.endsWith("joined the game") || chatMessage.endsWith("left the game")) {
				chatMessage = "**" + chatMessage + "**";
			}

			// Proofing for Minecraft Usernames
			chatMessage = chatMessage.replaceAll("_", "\\_");

			// Sending final message
			sendMessage(client, chatMessage);
		}
	},
};
