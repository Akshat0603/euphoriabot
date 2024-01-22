"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
exports.event = {
    name: "guildMemberRemove",
    execute: async (client, member) => {
        // checking if person was member
        if (!member.roles.cache.has(client.memberRoleID))
            return;
        // get member channel
        const channel = client.channels.cache.get(client.channelMemberListID);
        // Impossible error check: Code #1
        if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
            console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #1`);
            return;
        }
        // Get message
        const message = (await channel.messages.fetch()).get(client.messageMemberListID);
        // Impossible error check: Code #2
        if (!message) {
            console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #2`);
            return;
        }
        const username = member.nickname ? member.nickname : member.displayName;
        // Remove from message
        await message.edit({ content: message.content.replace(`\n- ${username}`, "") });
        console.log(`[EVENTS] Removed member ${member.user.username} from member-list message.`);
        const rmembers = member.guild.roles.cache.get(client.memberRoleID).members;
        await channel.setTopic(`${rmembers.size} members!`);
        // Remove from whitelist
        await client.SMP.send("send command", [`whitelist remove ${username}`]);
        await client.CMP.send("send command", [`whitelist remove ${username}`]);
        // send message to #post-application
        const pChannel = client.channels.cache.get(client.channelPostApplicationID);
        // Impossible error check: Code #3
        if (!pChannel || pChannel.type !== discord_js_1.ChannelType.GuildText) {
            console.error(`[EVENTS] An error occured while executing event 'guildMemberRemove'! Code #3`);
            return;
        }
        await pChannel.send({
            content: `<@${member.id}> was removed from the server. \n- Left the discord server.`,
        });
        // Update member-lists
        var removedMembers = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
        removedMembers.push(member.id);
        (0, fs_1.writeFileSync)("./storage/removed-members.json", JSON.stringify(removedMembers));
        var members = JSON.parse((0, fs_1.readFileSync)("./storage/member-list.json").toString());
        members.splice(members.indexOf(member.id), 1);
        (0, fs_1.writeFileSync)("./storage/member-list.json", JSON.stringify(members));
    },
};
//# sourceMappingURL=guild-member-remove.js.map