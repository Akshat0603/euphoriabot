"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: "interactionCreate",
    function: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) {
                await interaction.reply({
                    content: "## <:no:1181140154623213569> An Error Occured!",
                    ephemeral: true,
                });
            }
            else {
                console.log(`[SLASH COMMANDS] Executed Command "${command.data.name}" by ${interaction.user.username}`);
                command.execute(client, interaction);
            }
        }
    },
};
//# sourceMappingURL=main.js.map