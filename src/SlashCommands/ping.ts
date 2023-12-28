import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "ping",
		description: "Replies with Pong! And the ping of the bot!",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
	},

	// COMMAND EXECUTION
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		await interaction.reply({
			content: `
# :ping_pong:  **Pong!**
The bot currently has a ping of \`${client.ws.ping}\` ms.
			`,
		});
	},
};
