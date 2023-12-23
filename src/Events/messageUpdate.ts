import { ChannelType, EmbedBuilder, Message } from "discord.js";
import { eventType } from "../Types/Events";
import myClient from "../client";

export const event: eventType = {
	name: "messageUpdate",
	execute: async (client: myClient, oldMessage: Message, newMessage: Message) => {
		if (
			oldMessage.partial ||
			newMessage.partial ||
			oldMessage.author?.bot ||
			oldMessage.content === newMessage.content
		)
			return;
		const channel = await client.channels.cache.get(client.channelLogMessageUpdateID);
		if (channel && channel.type === ChannelType.GuildText) {
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
			channel.send({ embeds: [messageEmbed] });
		} else {
			console.error("AN ERROR OCCURED WHILE LOGGING A DELETED MESSAGE!");
		}
	},
};
