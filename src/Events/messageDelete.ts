import { ChannelType, EmbedBuilder, Message } from "discord.js";
import { eventType } from "../Types/Events";
import myClient from "../client";

export const event: eventType = {
	name: "messageDelete",
	execute: async (client: myClient, message: Message) => {
		if (message.partial || message.author?.bot) return;
		const channel = await client.channels.cache.get(client.channelLogMessageDeleteID);
		if (channel && channel.type === ChannelType.GuildText) {
			const messageEmbed = new EmbedBuilder()
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL({ extension: "jpg" }),
				})
				.setColor("Red")
				.setTitle(`The following message was deleted in ${message.channel}`)
				.setDescription(message.content)
				.setFooter(client.embedFooter);
			channel.send({ embeds: [messageEmbed] });
		} else {
			console.error("AN ERROR OCCURED WHILE LOGGING A DELETED MESSAGE!");
		}
	},
};
