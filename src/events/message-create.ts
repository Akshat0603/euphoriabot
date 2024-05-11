import { Message, ChannelType } from "discord.js";
import myClient from "../client";
import { eventType } from "../types/events";
import {readFileSync, writeFileSync} from "fs";

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
			messageContent = messageContent.replace(
				messageRegex,
				message.content.replaceAll('"', "'")
			);

			client.SMP.send("send command", [messageContent]);

		} else if (message.channelId === client.channelCMPchatID) {
			let messageContent = format;
			let username: string;

			if (typeof message.member?.nickname === "string") {
				username = message.member.nickname;
			} else if (message.author.displayName) {
				username = message.author.displayName;
			} else username = message.author.username;

			messageContent = messageContent.replace(usernameRegex, username);
			messageContent = messageContent.replace(
				messageRegex,
				message.content.replaceAll('"', '\\"')
			);

			client.CMP.send("send command", [messageContent]);
		}

		else if (message.channelId === client.channelMemberListID) {
			let name = message.content;
			await message.delete();

			if(name.split(" ").length > 1) return;

			const messageMember = message.member!;

			if (messageMember.roles.cache.has(client.memberRoleID) || !messageMember.roles.cache.has(client.S1memberRoleID)) return;

			await messageMember.setNickname(name);
			await messageMember.roles.add(client.memberRoleID);

			// adding them to member list channel
			var memberList: string[] = JSON.parse(readFileSync("./storage/member-list.json").toString());
			memberList.push(messageMember.id);
			writeFileSync("./storage/member-list.json", JSON.stringify(memberList));

			const mChannel = client.channels.cache.get(client.channelMemberListID);
			// impossible error check
			if (!mChannel || mChannel.type !== ChannelType.GuildText) {
				console.log(
					`[EVENTS] An error occured in "message-create"! Code #4`
				);
				return;
			}

			var content = "";
			var members = message.guild!.roles.cache.get(client.memberRoleID)!.members;
			members = members.sort((a, b) =>
				(a.nickname || a.displayName).localeCompare(b.nickname || b.displayName)
			);
			for (const member of members) {
				content =
					content +
					`\n- ${(member[1].nickname ? member[1].nickname : member[1].displayName).replace(
						"_",
						"\\_"
					)}`;
			}

			const messages = await mChannel.messages.fetch();
			const IDKmessage = messages.get(client.messageMemberListID);
			await IDKmessage?.edit({ content });
			await mChannel.setTopic(`${members.size} members!`);

		}

		// fun responses
		else if (message.content.toLowerCase() === "lol") {
			await message.reply({ content: message.content });
		}
	},
};
