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
            await interaction.reply({ content: "An error occured! Code #1", ephemeral: true });
            console.error(`[SLASH COMMANDS] An error occured while executing command 'send-command'! Code #1`);
            return;
        }
        // permissions check
        const member = interaction.guild.members.cache.get(interaction.user.id);
        var ok = false;
        if (interaction.memberPermissions?.has("Administrator")) {
            ok = true;
        }
        else if (member?.roles.cache.has(client.dmarkerRoleID) && command.split(" ")[0] === "dmarker") {
            ok = true;
        }
        if (!ok) {
            await interaction.reply({
                ephemeral: true,
                content: `You don't have permission to use this command!`,
            });
            return;
        }
        var SMPresponse = "";
        // Main execution
        if (server === "smp" || server === "both")
            SMPresponse = await client.SMP.request("sendCommand", command);
        //if (server === "cmp" || server === "both") client.CMP.send("send command", [command]);
        console.log(SMPresponse);
        // Done
        await interaction.reply({
            ephemeral: true,
            content: `Executed command \`${command}\` on ${server === "both" ? server : server.toUpperCase()} server${server === "both" ? "s" : ""}. ${SMPresponse ? `SMP Response: ${SMPresponse}.` : ""}`,
        });
    },
};
//# sourceMappingURL=send-command.js.map