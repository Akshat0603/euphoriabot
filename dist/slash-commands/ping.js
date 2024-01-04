"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
exports.slashCommand = {
    // COMMAND DATA
    data: {
        name: "ping",
        description: "Replies with Pong! And the ping of the bot!",
        defaultMemberPermissions: discord_js_1.PermissionFlagsBits.Administrator,
    },
    // COMMAND EXECUTION
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