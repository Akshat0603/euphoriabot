"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong! And the ping of the bot!")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
exports.slashCommand = {
    data: commandData,
    execute: async (client, interaction) => {
        await interaction.reply({
            content: `
# :ping_pong:  **Pong!**
The bot currently has a ping of \`${client.ws.ping}\` ms.
			`,
        });
    },
};
//# sourceMappingURL=ping.js.map