import { ActivityType, ChannelType } from "discord.js";
import { eventType } from "../types/events";
import myClient from "../client";
import { doingAppObject } from "../types/doing-app";
import { writeFileSync } from "fs";

export const event: eventType = {
	name: "ready",
	execute: async (client: myClient) => {
		// console log and change activity
		console.log(`${client.user?.username} is online!`);
		client.user?.setActivity({
			name: "Trying to replace Akshat.",
			type: ActivityType.Custom,
		});

		// Loading slash commands
		client.slashCommands.forEach(async (command) => {
			try {
				await client.application!.commands.create(command.data, client.guildID);
				console.log(`[SLASH COMMANDS] Refreshed Command: '${command.data.name}'`);
			} catch (error) {
				console.error(error);
			}
		});

		// refresh doing-app
		var doingappdatas: doingAppObject[] = [];
		const applyChannel = client.channels.cache.get(client.channelApplyID);

		//impossible error check: code #1
		if (!applyChannel || applyChannel.type !== ChannelType.GuildText) {
			console.error(`[EVENTS] An error occured while executing event 'ready'! Code #1`);
		} else {
			for await (const channel of applyChannel.threads.cache) {
				await channel[1].members.fetch();
				for await (const tmember of channel[1].members.cache) {
					const member = await applyChannel.guild.members.cache.get(tmember[1].id);
					if (member && member.roles.cache.has(client.waitingRoleID)) {
						const doingAppData: doingAppObject = {
							userID: member.id,
							ticketID: channel[1].id,
						};
						doingappdatas.push(doingAppData);
					}
				}
			}
		}

		// refresh member-list
		const mChannel = client.channels.cache.get(client.channelMemberListID);
		if (!mChannel || mChannel.type !== ChannelType.GuildText) throw new Error();
		const messages = await mChannel.messages.fetch();
		const message = messages.get(client.messageMemberListID);
		var content = "";
		var memberList: string[] = [];
		const role = mChannel.guild.roles.cache.get(client.memberRoleID)!;
		var members = role.members;
		members = members.sort((a, b) =>
			(a.nickname || a.displayName).localeCompare(b.nickname || b.displayName)
		);
		for (const member of members) {
			memberList.push(member[1].id);
			content =
				content +
				`\n- ${(member[1].nickname ? member[1].nickname : member[1].displayName).replace(
					"_",
					"\\_"
				)}`;
		}

		await message!.edit({ content });
		await mChannel.setTopic(`${members.size} members!`);

		writeFileSync("./storage/doing-app.json", JSON.stringify(doingappdatas));
		console.log(
			`[REGISTRY] Refreshed doing-app.json with ${doingappdatas.length} members doing the application.`
		);
		writeFileSync("./storage/member-list.json", JSON.stringify(memberList));
		console.log(`[REGISTRY] Refreshed member-list.json with ${memberList.length} members.`);

		// Connect to both servers
		await client.SMP.connect();
		//await client.CMP.connect();
	},
};
