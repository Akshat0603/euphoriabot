import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "mods",
		description: "Responds with the mod list of the server.",
	},

	// COMMAND EXECUTION
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const response = await interaction.deferReply({ ephemeral: true });
		var channel = await client.channels.cache.get(client.channelEuphoriaID);
		if (channel?.partial) {
			channel = await channel.fetch();
			console.log("channel fetched");
		}
		// Impossible error check: Code #1 and #2
		if (channel?.type === ChannelType.GuildText) {
			const messages = await channel.messages.fetch();
			const message = messages.get(client.messageModsID);
			if (message) {
				response.edit({
					content: message.content,
				});
			} else {
				response.edit({
					content: "## <:no:1181140154623213569> An Error Occured! Code #2",
				});
			}
		} else {
			response.edit({
				content: "## <:no:1181140154623213569> An Error Occured! Code #1",
			});
		}
	},
};
