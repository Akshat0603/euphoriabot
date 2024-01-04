"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
async function statusSubcommand(client, interaction) {
    const reply = await interaction.deferReply({ ephemeral: true });
    const newStatus = interaction.options.data[0].options[0].value === "open" ? true : false;
    var appSettings = JSON.parse((0, fs_1.readFileSync)("./storage/app-settings.json").toString());
    // Checking if status is same
    if (appSettings.open === newStatus) {
        await reply.edit({
            content: `## Applications are already ${newStatus === true ? "open" : "closed"}!`,
        });
        return;
    }
    else
        appSettings.open = newStatus;
    // Getting previous message
    const channel = client.channels.cache.get(client.channelApplyID);
    if (channel.type !== discord_js_1.ChannelType.GuildText) {
        await reply.edit({ content: "An Error Occured! Code #1" });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`);
        return;
    }
    const messages = await channel.messages.fetch();
    const msg = messages.get(appSettings.messageID);
    await msg?.delete();
    // Changing the status
    const message = await channel.send({
        content: appSettings.open === true
            ? "# <:yes:1181140152333115442> Applications Open! <:yes:1181140152333115442>"
            : "# <:no:1181140154623213569> Applications Closed! <:no:1181140154623213569>",
    });
    appSettings.messageID = message.id;
    (0, fs_1.writeFileSync)("./storage/app-settings.json", JSON.stringify(appSettings));
    await reply.edit({ content: "Done" });
}
async function acceptSubcommand(client, interaction) { }
async function denySubcommand(client, interaction) { }
exports.slashCommand = {
    // COMMAND DATA
    data: {
        name: "application",
        description: "Control the application system of the server",
        defaultMemberPermissions: discord_js_1.PermissionFlagsBits.Administrator,
        options: [
            {
                name: "status",
                description: "Open or Close the applications of the server",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "input",
                        description: "Input field to open/close.",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: "open", value: "open" },
                            { name: "close", value: "close" },
                        ],
                    },
                ],
            },
            {
                name: "accept",
                description: "Accept someone's application",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "username",
                        description: "Minecraft username of the person being accepted.",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "deny",
                description: "Deny someone's application",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            },
        ],
    },
    execute: async (client, interaction) => {
        // redirect to correct subcommand
        if (interaction.options.data[0].name === "status")
            statusSubcommand(client, interaction);
        else if (interaction.options.data[0].name === "accept")
            acceptSubcommand(client, interaction);
        else if (interaction.options.data[0].name === "deny")
            denySubcommand(client, interaction);
    },
};
//# sourceMappingURL=application.js.map