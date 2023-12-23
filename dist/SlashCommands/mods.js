"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName("mods")
    .setDescription("Responds with the mod list of the server.");
exports.slashCommand = {
    data: commandData,
    execute: async (client, interaction) => {
        const response = await interaction.deferReply({ ephemeral: true });
        var channel = await client.channels.cache.get(client.channelEuphoriaID);
        if (channel?.partial) {
            channel = await channel.fetch();
            console.log("channel fetched");
        }
        if (channel?.type === discord_js_1.ChannelType.GuildText) {
            const messages = await channel.messages.fetch();
            const message = messages.get(client.messageModsID);
            if (message) {
                response.edit({
                    content: message.content,
                });
            }
            else {
                response.edit({
                    content: "## <:no:1181140154623213569> An Error Occured! Code #2",
                });
            }
        }
        else {
            response.edit({
                content: "## <:no:1181140154623213569> An Error Occured! Code #1",
            });
        }
    },
};
//# sourceMappingURL=mods.js.map