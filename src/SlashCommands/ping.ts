import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";

const commandData = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong! And the ping of the bot!")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const slashCommand: slashCommandType = {
	data: commandData,
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		await interaction.reply({
			content: `
# :ping_pong:  **Pong!**
The bot currently has a ping of \`${client.ws.ping}\` ms.
			`,
		});
	},
};
