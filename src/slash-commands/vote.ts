/* import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import { slashCommandType } from "../types/slash-commands";
import myClient from "../client";

// -> vote create <yes-no / multiple-choice>
// vote delete <messageID>
// vote end <messageID>
// vote get [messageID]
// vote set <number>

async function createSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	var mainEmbed = new EmbedBuilder()
		.setColor("#FF0000")
		.setTitle("Create a new vote")
		.setDescription(
			"The vote message preview will be displayed above this message. Use the buttons below to set certain things about the vote. When the color of this embed changes to green, the vote is ready to be posted."
		);

	var numberButton = new ButtonBuilder({});

	var actionRow1 = new ActionRowBuilder();

	const reply = await interaction.reply({});
}

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "vote",
		description: "Control the voting system",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		options: [
			{
				name: "create",
				description: "Create a new vote",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},

	// COMMAND EXECUTION
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const subCommand = interaction.options.getSubcommand(true);
		if (subCommand === "create") createSubcommand(client, interaction);
	},
};
 */
