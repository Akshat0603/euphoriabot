"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
// SLASH COMMAND EXECUTION
async function ChatInputCommand(client, interaction) {
    const command = client.slashCommands.get(interaction.commandName);
    // Impossible error check
    if (!command) {
        await interaction.reply({
            content: "## <:no:1181140154623213569> An Error Occured! Couldn't find the command!",
            ephemeral: true,
        });
        console.warn(`[WARNING] [SLASH COMMANDS] "${interaction.commandName}" was not found!`);
    }
    else {
        console.log(`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`);
        command.execute(client, interaction);
    }
}
// BUTTON INTERACTION EXECUTION
async function ButtonCommand(client, interaction) {
    const button = client.Buttons.get(interaction.customId);
    // Impossible Error Check
    if (!button) {
        await interaction.reply({
            content: "## <:no:1181140154623213569> An Error Occured! Couldn't find the execution file for this button!",
            ephemeral: true,
        });
        console.warn(`[WARNING] [BUTTONS] "${interaction.customId}" was not found!`);
    }
    else {
        console.log(`[BUTTONS] Executed "${interaction.customId}" by ${interaction.user.username}`);
        button.execute(client, interaction);
    }
}
exports.event = {
    name: "interactionCreate",
    execute: async (client, interaction) => {
        // Slash Command
        if (interaction.isChatInputCommand())
            ChatInputCommand(client, interaction);
        // Button
        if (interaction.isButton())
            ButtonCommand(client, interaction);
    },
};
//# sourceMappingURL=interaction-create.js.map