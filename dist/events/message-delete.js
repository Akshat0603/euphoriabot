"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "messageDelete",
    execute: async (client, message) => {
        // LOGGING THE DELETED MESSAGE
        // Checking if possible / bot message
        if (message.partial || message.author?.bot)
            return;
        // Finding the channel and logging it
        const channel = await client.channels.cache.get(client.channelLogMessageDeleteID);
        // Impossible error check
        if (channel && channel.type === discord_js_1.ChannelType.GuildText) {
            const messageEmbed = new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ extension: "jpg" }),
            })
                .setColor("Red")
                .setTitle(`The following message was deleted in ${message.channel}`)
                .setDescription(message.content)
                .setFooter(client.embedFooter);
            channel.send({ embeds: [messageEmbed] });
        }
        else {
            console.error("[EVENTS] AN ERROR OCCURED WHILE LOGGING A DELETED MESSAGE!");
        }
    },
};
//# sourceMappingURL=message-delete.js.map