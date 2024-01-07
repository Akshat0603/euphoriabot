"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "guildMemberRemove",
    execute: async (client, member) => {
        const channel = client.channels.cache.get(client.channelMemberListID);
        // Impossible error check: Code #1
        if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
            console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #1`);
        }
        else {
            // Get message
            const message = (await channel.messages.fetch()).get(client.messageMemberListID);
            // Impossible error check: Code #2
            if (!message) {
                console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #2`);
            }
            else {
                // Remove from message
                await message.edit({ content: message.content.replace(`\n- <@${member.id}>`, "") });
                console.log(`[EVENTS] Removed member ${member.user.username} from member-list message.`);
                // Remove from whitelist
                const username = member.nickname ? member.nickname : member.displayName;
                await client.SMP.send("send command", [`whitelist remove ${username}`]);
                await client.CMP.send("send command", [`whitelist remove ${username}`]);
                // send message to #post-application
                const pChannel = client.channels.cache.get(client.channelPostApplicationID);
                // Impossible error check: Code #3
                if (!pChannel || pChannel.type !== discord_js_1.ChannelType.GuildText) {
                    console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #3`);
                }
                else {
                    await pChannel.send({
                        content: `<@${member.id} was removed from the server. \n- Left the discord server.`,
                    });
                }
            }
        }
    },
};
//# sourceMappingURL=guild-member-remove.js.map