import { ActivityType } from "discord.js";
import { eventType } from "../types/events";
import myClient from "../client";

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

		// Connect to both servers
		await client.SMP.connect();
		await client.CMP.connect();
	},
};
