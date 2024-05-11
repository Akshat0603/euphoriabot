import { ChannelType, EmbedBuilder, Message } from "discord.js";
import { eventType } from "../types/events";
import myClient from "../client";

export const event: eventType = {
	name: "messageUpdate",
	execute: async (client: myClient, oldMessage: Message, newMessage: Message) => {
		// LOGGING MESSAGE CONTENT UPDATE

		// Checking if possible / should do it
		if (
			oldMessage.partial ||
			newMessage.partial ||
			oldMessage.author?.bot ||
			oldMessage.content === newMessage.content
		) {
			return;
		}
		if (oldMessage.content.length + newMessage.content.length > 4000) return;

		// Finding the right channel and logging it
		const channel = client.channels.cache.get(client.channelLogMessageUpdateID);
		// Impossible error check
		if (channel && channel.type === ChannelType.GuildText) {
			try {
				const messageEmbed = new EmbedBuilder()
					.setAuthor({
						name: oldMessage.author.username,
						iconURL: oldMessage.author.displayAvatarURL({ extension: "jpg" }),
					})
					.setColor("Yellow")
					.setTitle(`The following message was edited in ${oldMessage.channel}`)
					.setFields([
						{ name: "OLD Message Content:", value: oldMessage.content },
						{ name: "NEW Message Content:", value: newMessage.content },
					])
					.setFooter(client.embedFooter);
				await channel.send({ embeds: [messageEmbed] });
			} catch {
				return
			}
		} else {
			console.error("[EVENTS] AN ERROR OCCURED WHILE LOGGING AN EDITED MESSAGE!");
		}
	},
};
