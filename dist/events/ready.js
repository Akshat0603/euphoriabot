"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
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
        // refresh doing-app
        var doingappdatas = [];
        client.channels.cache.forEach((channel) => {
            if (channel.type === discord_js_1.ChannelType.GuildText) {
                if (channel.name.startsWith("🎫╏app-")) {
                    channel.permissionOverwrites.cache.forEach((perm) => {
                        if (perm.type === 1) {
                            const doingAppData = {
                                userID: perm.id,
                                ticketID: channel.id,
                            };
                            doingappdatas.push(doingAppData);
                        }
                    });
                }
            }
        });
        // refresh member-list
        var memberList = [];
        client.guilds.cache.forEach((guild) => {
            if (guild.id === client.guildID) {
                guild.roles.cache.forEach((role) => {
                    if (role.id === client.memberRoleID) {
                        role.members.forEach((member) => {
                            memberList.push(member.id);
                        });
                    }
                });
            }
        });
        (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(doingappdatas));
        console.log(`[REGISTRY] Refreshed doing-app.json with ${doingappdatas.length} members doing the application.`);
        (0, fs_1.writeFileSync)("./storage/member-list.json", JSON.stringify(memberList));
        console.log(`[REGISTRY] Refreshed member-list.json with ${memberList.length} members.`);
        // Connect to both servers
        await client.SMP.connect();
        await client.CMP.connect();
    },
};
//# sourceMappingURL=ready.js.map