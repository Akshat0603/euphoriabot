import { BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { eventType } from "../Types/Events";
import myClient from "../client";

async function ChatInputCommand(client: myClient, interaction: ChatInputCommandInteraction) {
	const command = client.slashCommands.get(interaction.commandName);
	if (!command) {
		await interaction.reply({
			content: "## <:no:1181140154623213569> An Error Occured! Couldn't find the command!",
			ephemeral: true,
		});
	} else {
		console.log(
			`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`
		);
		command.execute(client, interaction);
	}
}

export const event: eventType = {
	name: "interactionCreate",
	execute: async (client: myClient, interaction: BaseInteraction) => {
		if (interaction.isChatInputCommand()) ChatInputCommand(client, interaction);
	},
};
