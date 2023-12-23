"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "messageUpdate",
    execute: async (client, oldMessage, newMessage) => {
        if (oldMessage.partial ||
            newMessage.partial ||
            oldMessage.author?.bot ||
            oldMessage.content === newMessage.content)
            return;
        const channel = await client.channels.cache.get(client.channelLogMessageUpdateID);
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
            console.error("AN ERROR OCCURED WHILE LOGGING A DELETED MESSAGE!");
        }
    },
};
//# sourceMappingURL=messageUpdate.js.map