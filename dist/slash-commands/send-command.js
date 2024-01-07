"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
exports.slashCommand = {
    data: {
        name: "send-command",
        description: "Send a command to the SMP or CMP or both",
        defaultMemberPermissions: discord_js_1.PermissionFlagsBits.Administrator,
        options: [
            {
                name: "server",
                description: "Which server to send the command to? or both?",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "SMP",
                        value: "smp",
                    },
                    {
                        name: "CMP",
                        value: "cmp",
                    },
                    {
                        name: "Both",
                        value: "both",
                    },
                ],
            },
            {
                name: "command",
                description: "What command to send?",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    // Main execution
    execute: async (client, interaction) => {
        // assigning values
        const server = interaction.options.data[0].value;
        const command = interaction.options.data[1].value;
        // impossible error check: code #1
        if (typeof server !== "string" || typeof command !== "string") {
            interaction.reply({ content: "An error occured! Code #1", ephemeral: true });
            console.error(`[SLASH COMMANDS] An error occured while executing command 'send-command'! Code #1`);
            return;
        }
        // Main execution
        if (server === "smp" || server === "both")
            await client.SMP.send("send command", [command]);
        if (server === "cmp" || server === "both")
            await client.CMP.send("send command", [command]);
        // Done
        interaction.reply({
            content: `Executed command \`${command}\` on ${server === "both" ? server : server.toUpperCase()} server${server === "both" ? "s" : ""}.`,
        });
    },
};
//# sourceMappingURL=send-command.js.map