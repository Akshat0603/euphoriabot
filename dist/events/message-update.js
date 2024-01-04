"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "messageUpdate",
    execute: async (client, oldMessage, newMessage) => {
        // LOGGING MESSAGE CONTENT UPDATE
        // Checking if possible / should do it
        if (oldMessage.partial ||
            newMessage.partial ||
            oldMessage.author?.bot ||
            oldMessage.content === newMessage.content) {
            return;
        }
        // Finding the right channel and logging it
        const channel = await client.channels.cache.get(client.channelLogMessageUpdateID);
        // Impossible error check
        if (channel && channel.type === discord_js_1.ChannelType.GuildText) {
            const messageEmbed = new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: oldMessage.author.username,
                iconURL: oldMessage.author.displayAvatarURL({ extension: "jpg" }),
            })
                .setColor("Yellow")
                .setTitle(`The following message was edited in ${oldMessage.channel}`)
                .setFields([
                { name: "OLD Message Content:", value: oldMessage.content },
                { name: "NEW Message Content:", value: newMessage.content },
            ])
                .setFooter(client.embedFooter);
            channel.send({ embeds: [messageEmbed] });
        }
        else {
            console.error("[EVENTS] AN ERROR OCCURED WHILE LOGGING AN EDITED MESSAGE!");
        }
    },
};
//# sourceMappingURL=message-update.js.map