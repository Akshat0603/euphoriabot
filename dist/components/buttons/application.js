"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const denyEmbed = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Application Process Cancelled!");
exports.button = {
    customID: "application",
    execute: async (client, interaction) => {
        // Buying more time
        const reply = await interaction.deferReply({ ephemeral: true });
        // Getting member
        const guild = interaction.guild;
        const member = guild?.members.cache.get(interaction.user.id);
        // Impossible Error Check
        if (!guild || !member) {
            await reply.edit({
                content: "## <:no:1181140154623213569> An Error Occured! Code #1",
            });
            console.warn(`[BUTTONS] An error occured while executing button "application"! Code #1`);
            return;
        }
        // Check if member
        if (member.roles.cache.has(client.memberRoleID)) {
            await reply.edit({
                content: "# YOU ARE ALREADY A MEMBER!",
            });
            return;
        }
        // Getting JSON files
        const removedMembers = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
        var alrApplying = JSON.parse((0, fs_1.readFileSync)("./storage/doing-app.json").toString());
        // Check if removed
        if (removedMembers.includes(member.id)) {
            await reply.edit({
                embeds: [
                    denyEmbed.setDescription("Removed/Denied members need to make a special request with the owner to re-apply."),
                ],
            });
            return;
        }
        // Check if already applying
        else if (alrApplying.some((check) => check.userID === member.id)) {
            await reply.edit({
                embeds: [
                    denyEmbed.setDescription("You seem to be already in the process of giving the application or waiting for your application to receive a response."),
                ],
            });
            return;
        }
        // Checking if applications closed
        var settings = JSON.parse((0, fs_1.readFileSync)("./storage/app-settings.json").toString());
        if (settings.open === false) {
            await reply.edit({
                embeds: [denyEmbed.setDescription("Applications are closed at the moment.")],
            });
            return;
        }
        settings.count = settings.count + 1;
        // Creating the application channel
        const ticket = await guild.channels.create({
            name: `🎫╏app-${settings.count > 999 ? settings.count : `0${settings.count}`}`,
            type: discord_js_1.ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ["ViewChannel", "AttachFiles", "EmbedLinks"],
                },
                {
                    id: member.id,
                    allow: ["ViewChannel"],
                },
            ],
        });
        // Sending Main Message
        await ticket.send({
            content: `## Euphoria SMP Application
You are required to answer all questions appropriately unless stated otherwise. You are to number your answers properly. It is recommended to answer in one message. *NOTE: Some of the questions exist for the sole reason of building trust.*

1. What is your name? (If you do not wish to share your real life name, please give us a one word, easy to pronounce, uncommon name that you would like to be called)
- What is your age?
- Which country are you from and what timezone? (Relative to GMT)
- Tell us about yourself as a person.
- What is your in-game name?
- How did you find this server?
- How long have you been playing Minecraft?
- What is your playstyle?
- How familiar are you with Create Mod? If yes, what addons do you play?
- Why do you want to join ***this*** SMP?

*If you wish to tell us anything else, you can add it after the answers to the questions.*`,
        });
        const msg = await ticket.send({ content: `<@${member}>` });
        msg.delete();
        const doingAppData = {
            userID: member.id,
            ticketID: ticket.id,
        };
        alrApplying.push(doingAppData);
        (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(alrApplying));
        (0, fs_1.writeFileSync)("./storage/app-settings.json", JSON.stringify(settings));
        member.roles.add(client.waitingRoleID);
        await reply.edit({ content: `Please do your application in <#${ticket.id}>.` });
    },
};
//# sourceMappingURL=application.js.map