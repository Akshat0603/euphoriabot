import { BaseInteraction } from "discord.js";
import { eventType } from "../../Types/Events";
import myClient from "../../client";

export const event: eventType = {
	name: "interactionCreate",
	function: async (client: myClient, interaction: BaseInteraction) => {
		if (interaction.isChatInputCommand()) {
			const command = client.slashCommands.get(interaction.commandName);
			if (!command) {
				await interaction.reply({
					content: "## <:no:1181140154623213569> An Error Occured!",
					ephemeral: true,
				});
			} else {
				console.log(
					`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`
				);
				command.execute(client, interaction);
			}
		}
	},
};
