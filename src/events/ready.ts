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
		const doingappdatas: doingAppObject[] = [];
		client.channels.cache.forEach((channel) => {
			if (channel.type === ChannelType.GuildText) {
				if (channel.name.startsWith("🎫╏app-")) {
					channel.permissionOverwrites.cache.forEach((perm) => {
						if (perm.type === 1) {
							const doingAppData: doingAppObject = {
								userID: perm.id,
								ticketID: channel.id,
							};
							doingappdatas.push(doingAppData);
						}
					});
				}
			}
		});
		writeFileSync("./storage/doing-app.json", JSON.stringify(doingappdatas));
		console.log(`[REGISTRY] Refreshed doing-app.json with\n` + doingappdatas);

		// Connect to both servers
		await client.SMP.connect();
		await client.CMP.connect();
	},
};
