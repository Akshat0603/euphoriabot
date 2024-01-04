import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction } from "discord.js";
import { eventType } from "../types/events";
import myClient from "../client";

// SLASH COMMAND EXECUTION
async function ChatInputCommand(client: myClient, interaction: ChatInputCommandInteraction) {
	const command = client.slashCommands.get(interaction.commandName);

	// Impossible error check
	if (!command) {
		await interaction.reply({
			content: "## <:no:1181140154623213569> An Error Occured! Couldn't find the command!",
			ephemeral: true,
		});
		console.warn(`[WARNING] [SLASH COMMANDS] "${interaction.commandName}" was not found!`);
	} else {
		console.log(
			`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`
		);
		command.execute(client, interaction);
	}
}

// BUTTON INTERACTION EXECUTION
async function ButtonCommand(client: myClient, interaction: ButtonInteraction) {
	const button = client.Buttons.get(interaction.customId);

	// Impossible Error Check
	if (!button) {
		await interaction.reply({
			content:
				"## <:no:1181140154623213569> An Error Occured! Couldn't find the execution file for this button!",
			ephemeral: true,
		});
		console.warn(`[WARNING] [BUTTONS] "${interaction.customId}" was not found!`);
	} else {
		console.log(`[BUTTONS] Executed "${interaction.customId}" by ${interaction.user.username}`);
		button.execute(client, interaction);
	}
}

export const event: eventType = {
	name: "interactionCreate",
	execute: async (client: myClient, interaction: BaseInteraction) => {
		// Slash Command
		if (interaction.isChatInputCommand()) ChatInputCommand(client, interaction);
		// Button
		if (interaction.isButton()) ButtonCommand(client, interaction);
	},
};
