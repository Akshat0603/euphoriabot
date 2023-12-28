import { ActivityType, Routes } from "discord.js";
import { eventType } from "../Types/Events";
import myClient from "../client";

export const event: eventType = {
	name: "ready",
	execute: async (client: myClient) => {
		// console log and change activityA
		console.log(`${client.user?.username} is online!`);
		client.user?.setActivity({
			name: "Preparing to replace Akshat.",
			type: ActivityType.Custom,
		});

		// Loading slash commands
		client.slashCommands.forEach(async (command) => {
			try {
				await client.application!.commands.create(command.data, client.guildId);
				console.log(`[SLASH COMMANDS] Refreshed command: '${command.data.name}'`);
			} catch (error) {
				console.error(error);
			}
		});
	},
};
