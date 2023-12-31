import { Message } from "discord.js";
import myClient from "../client";
import { eventType } from "../types/events";

const format = `tellraw @a ["",{"text":"[Discord] ","bold":true,"color":"blue"},{"text":"{username}: ","color":"gray"},{"text":"{message}","color":"white"}]`;
const usernameRegex = /{username}/;
const messageRegex = /{message}/;

export const event: eventType = {
	name: "messageCreate",
	execute: async (client: myClient, message: Message) => {
		// checking if it's a SMP/CMP chat message
		if (message.channelId === client.channelSMPchatID) {
			let messageContent = format;
			messageContent = messageContent.replace(usernameRegex, message.member!.nickname!);
			messageContent = messageContent.replace(messageRegex, message.content);

			await client.SMP.send("send command", [messageContent]);
		} else if (message.channelId === client.channelCMPchatID) {
			let messageContent = format;
			messageContent = messageContent.replace(usernameRegex, message.member!.nickname!);
			messageContent = messageContent.replace(messageRegex, message.content);

			await client.CMP.send("send command", [messageContent]);
		}
	},
};
