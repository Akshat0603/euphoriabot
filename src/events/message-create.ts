import { Message } from "discord.js";
import myClient from "../client";
import { eventType } from "../types/events";

const format = `tellraw @a ["",{"text":"[Discord] ","bold":true,"color":"blue"},{"text":"{username}: ","color":"gray"},{"text":"{message}","color":"white"}]`;
const usernameRegex = /{username}/;
const messageRegex = /{message}/;

export const event: eventType = {
	name: "messageCreate",
	execute: async (client: myClient, message: Message) => {
		// check for bot
		if (message.author.bot || message.webhookId) return;

		// checking if it's a SMP/CMP chat message
		if (message.channelId === client.channelSMPchatID) {
			let messageContent = format;
			let username: string;

			if (typeof message.member?.nickname === "string") {
				username = message.member.nickname;
			} else if (message.author.displayName) {
				username = message.author.displayName;
			} else username = message.author.username;

			messageContent = messageContent.replace(usernameRegex, username);
			messageContent = messageContent.replace(messageRegex, message.content);

			await client.SMP.send("send command", [messageContent]);
		} else if (message.channelId === client.channelCMPchatID) {
			let messageContent = format;
			let username: string;

			if (typeof message.member?.nickname === "string") {
				username = message.member.nickname;
			} else if (message.author.displayName) {
				username = message.author.displayName;
			} else username = message.author.username;

			messageContent = messageContent.replace(usernameRegex, username);
			messageContent = messageContent.replace(messageRegex, message.content);

			await client.CMP.send("send command", [messageContent]);
		}
	},
};
