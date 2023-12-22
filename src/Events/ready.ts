import { ActivityType } from "discord.js";
import { eventType } from "../Types/Events";
import myClient from "../client";

export const event: eventType = {
	name: "ready",
	execute: (client: myClient) => {
		console.log(`${client.user?.username} is online!`);
		client.user?.setActivity({
			name: "Preparing to replace Akshat.",
			type: ActivityType.Custom,
		});
	},
};
