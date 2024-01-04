"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "ready",
    execute: async (client) => {
        // console log and change activity
        console.log(`${client.user?.username} is online!`);
        client.user?.setActivity({
            name: "Trying to replace Akshat.",
            type: discord_js_1.ActivityType.Custom,
        });
        // Loading slash commands
        client.slashCommands.forEach(async (command) => {
            try {
                await client.application.commands.create(command.data, client.guildID);
                console.log(`[SLASH COMMANDS] Refreshed Command: '${command.data.name}'`);
            }
            catch (error) {
                console.error(error);
            }
        });
        // Connect to both servers
        await client.SMP.connect();
        await client.CMP.connect();
    },
};
//# sourceMappingURL=ready.js.map