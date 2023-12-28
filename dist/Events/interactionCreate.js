"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
async function ChatInputCommand(client, interaction) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
        await interaction.reply({
            content: "## <:no:1181140154623213569> An Error Occured! Couldn't find the command!",
            ephemeral: true,
        });
        console.error(interaction);
    }
    else {
        console.log(`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`);
        command.execute(client, interaction);
    }
}
exports.event = {
    name: "interactionCreate",
    execute: async (client, interaction) => {
        if (interaction.isChatInputCommand())
            ChatInputCommand(client, interaction);
    },
};
//# sourceMappingURL=interactionCreate.js.map