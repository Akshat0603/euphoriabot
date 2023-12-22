import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";

export const slashCommand: slashCommandType = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong! And the ping of the bot!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const ping = client.ws.ping;
		await interaction.reply({
			content: `
# :ping_pong:  **Pong!**
The bot currently has a ping of \`${ping}\` ms.
			`,
		});
	},
};
