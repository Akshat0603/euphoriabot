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
async function acceptSubcommand(client, interaction) {
    // getting current applications
    var doingApp = JSON.parse((0, fs_1.readFileSync)("./storage/doing-app.json").toString());
    const appChannel = interaction.channel;
    // impossible error check: code #1
    if (!appChannel) {
        interaction.reply({
            content: "An Error Occured! Code #1",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`);
        return;
    }
    // checking for currect channel
    if (!doingApp.some((app) => app.ticketID === appChannel.id)) {
        await interaction.reply({
            content: "## You cannot use this command in this channel!",
            ephemeral: true,
        });
        return;
    }
    // impossible error check: code #1
    if (appChannel.type !== discord_js_1.ChannelType.PrivateThread) {
        interaction.reply({
            content: "An Error Occured! Code #1",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`);
        return;
    }
    // buying more time
    const reply = await interaction.deferReply();
    // data assigning
    const doingAppData = doingApp.find((app) => app.ticketID === interaction.channel.id);
    // Impossible error check: code #2
    if (!doingAppData) {
        reply.edit({
            content: "An Error Occured! Code #2",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #2`);
        return;
    }
    const username = interaction.options.data[0].options[0].value;
    const member = interaction.guild?.members.cache.get(doingAppData.userID);
    // Impossible error check: code #3
    if (!member || typeof username !== "string") {
        reply.edit({
            content: "An Error Occured! Code #3",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #3`);
        return;
    }
    // Adding member to the server
    await member.roles.add(client.memberRoleID);
    await member.roles.remove(client.waitingRoleID);
    await member.setNickname(username);
    client.SMP.send("send command", [`whitelist add ${username}`]);
    client.CMP.send("send command", [`whitelist add ${username}`]);
    doingApp.splice(doingApp.indexOf(doingAppData), 1);
    (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(doingApp));
    var memberList = JSON.parse((0, fs_1.readFileSync)("./storage/member-list.json").toString());
    memberList.push(member.id);
    (0, fs_1.writeFileSync)("./storage/member-list.json", JSON.stringify(memberList));
    const channel = client.channels.cache.get(client.channelApplicationResultID);
    // Impossible error check
    if (channel.type !== discord_js_1.ChannelType.GuildText) {
        reply.edit({
            content: "An Error Occured! Code #4",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`);
        return;
    }
    // finalizing with channels and messages
    const mainEmbed = new discord_js_1.EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Application Accepted!")
        .setDescription(`Application No. \`${appChannel.name.replace("🎫╏app-", "")}\` of user \`${username}\` has been accepted! \nPlease go through <#${client.channelEuphoriaID}> before joining. Your <#${client.forumSuggestionID}> is valuable to us, just check if your suggestion has been posted before or not.`)
        .setFooter({ text: "Have fun!" });
    await appChannel.members.remove(member.id);
    await appChannel.edit({
        name: appChannel.name.replace("🎫", "✅"),
        locked: true,
        archived: true,
    });
    reply.edit({ embeds: [mainEmbed] });
    const msg = await channel.send({ content: `<@${member.id}>`, embeds: [mainEmbed] });
    msg.react("❤");
    // adding them to member list channel
    const mChannel = client.channels.cache.get(client.channelMemberListID);
    // impossible error check
    if (!mChannel || mChannel.type !== discord_js_1.ChannelType.GuildText) {
        reply.edit({
            content: "An Error Occured! Code #4",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`);
        return;
    }
    const messages = await mChannel.messages.fetch();
    const message = messages.get(client.messageMemberListID);
    message?.edit({
        content: message.content + `\n- <@${member.id}>`,
    });
}
async function rejectSubcommand(client, interaction) {
    // getting current applications
    var doingApp = JSON.parse((0, fs_1.readFileSync)("./storage/doing-app.json").toString());
    const appChannel = interaction.channel;
    // impossible error check: code #1
    if (!appChannel) {
        interaction.reply({
            content: "An Error Occured! Code #1",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`);
        return;
    }
    // checking for currect channel
    if (!doingApp.some((app) => app.ticketID === appChannel.id)) {
        await interaction.reply({
            content: "## You cannot use this command in this channel!",
            ephemeral: true,
        });
        return;
    }
    // impossible error check: code #1
    if (appChannel.type !== discord_js_1.ChannelType.PrivateThread) {
        interaction.reply({
            content: "An Error Occured! Code #1",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`);
        return;
    }
    // buying more time
    const reply = await interaction.deferReply();
    // data assigning
    const doingAppData = doingApp.find((app) => app.ticketID === interaction.channel.id);
    // Impossible error check: code #2
    if (!doingAppData) {
        reply.edit({
            content: "An Error Occured! Code #2",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #2`);
        return;
    }
    const member = interaction.guild?.members.cache.get(doingAppData.userID);
    if (member) {
        await member.roles.remove(client.waitingRoleID);
    }
    doingApp.splice(doingApp.indexOf(doingAppData), 1);
    (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(doingApp));
    var rMemberList = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
    rMemberList.push(doingAppData.userID);
    (0, fs_1.writeFileSync)("./storage/removed-members.json", JSON.stringify(rMemberList));
    const channel = client.channels.cache.get(client.channelApplicationResultID);
    // Impossible error check: code #4
    if (channel.type !== discord_js_1.ChannelType.GuildText) {
        reply.edit({
            content: "An Error Occured! Code #4",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #4`);
        return;
    }
    // finalizing with channels and messages
    const mainEmbed = new discord_js_1.EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Application Rejected!")
        .setDescription(`Application No. \`${appChannel.name.replace("🎫╏app-", "")}\` has been rejected! \nIf you wish to try again, please make a special request with the owner.`);
    if (member)
        await appChannel.members.remove(member.id);
    await appChannel.edit({
        name: appChannel.name.replace("🎫", "❌"),
        locked: true,
        archived: true,
    });
    await channel.send({ content: `<@${doingAppData.userID}>`, embeds: [mainEmbed] });
    await reply.edit({ embeds: [mainEmbed] });
}
async function allowSubcommand(interaction) {
    const reply = await interaction.deferReply({ ephemeral: true });
    // Impossible Error check: code #5
    if (interaction.options.data[0].options[0].type !== discord_js_1.ApplicationCommandOptionType.User) {
        reply.edit({
            content: "An Error Occured! Code #5",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #5`);
        return;
    }
    const user = interaction.options.data[0].options[0].value;
    // Impossible Error check: code #6
    if (typeof user !== "string") {
        reply.edit({
            content: "An Error Occured! Code #6",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #6`);
        return;
    }
    // Getting removed member list
    var rMemberList = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
    if (!rMemberList.includes(user)) {
        reply.edit({
            content: "That user is not removed/denied!",
        });
        console.log(`[SLASH COMMANDS] User ${user} is not removed!`);
        return;
    }
    rMemberList.splice(rMemberList.indexOf(user));
    (0, fs_1.writeFileSync)("./storage/removed-members.json", JSON.stringify(rMemberList));
    reply.edit({ content: `<@${user}> is now allowed to redo their application!` });
}
async function removeSubcommand(client, interaction) {
    // buy more time
    const reply = await interaction.deferReply({ ephemeral: true });
    // member
    const memberid = interaction.options.data[0].options[0].value;
    // impossible error check: code #4
    if (typeof memberid !== "string") {
        reply.edit({
            content: "An error occured! Code #4",
        });
        console.error(`[EVENTS] An error occured while executing command 'application'! Code #4`);
        return;
    }
    const member = interaction.guild?.members.cache.get(memberid);
    // impossible error check: code #5
    if (!member) {
        reply.edit({
            content: "An error occured! Code #5",
        });
        console.error(`[EVENTS] An error occured while executing command 'application'! Code #5`);
        return;
    }
    // checking if person was member
    if (!member.roles.cache.has(client.memberRoleID)) {
        reply.edit({
            content: "That user is not a member!",
        });
        return;
    }
    else if (member.id === interaction.guild.ownerId) {
        reply.edit({
            content: "# YOU CANNOT REMOVE THE LORD!",
        });
    }
    // get member channel
    const channel = client.channels.cache.get(client.channelMemberListID);
    // Impossible error check: Code #1
    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
        console.error(`[EVENTS] An error occured while executing command 'application'! Code #1`);
        return;
    }
    // Get message
    const message = (await channel.messages.fetch()).get(client.messageMemberListID);
    // Impossible error check: Code #2
    if (!message) {
        console.error(`[EVENTS] An error occured while executing command 'application'! Code #2`);
        return;
    }
    // Remove from message and remove role
    await member.roles.remove(client.memberRoleID);
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
        console.error(`[EVENTS] An error occured while executing command 'application'! Code #3`);
        return;
    }
    // message
    var content = `<@${member.id}> was removed from the server.`;
    const reason1 = interaction.options.data[0].options[1].value;
    if (typeof reason1 === "string") {
        content = content + `\n- ${reason1}`;
    }
    const reason2 = interaction.options.data[0].options[2].value;
    if (typeof reason2 === "string") {
        content = content + `\n- ${reason2}`;
    }
    const reason3 = interaction.options.data[0].options[3].value;
    if (typeof reason3 === "string") {
        content = content + `\n- ${reason3}`;
    }
    await pChannel.send({ content });
    // Update member-lists
    var removedMembers = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
    removedMembers.push(member.id);
    (0, fs_1.writeFileSync)("./storage/removed-members.json", JSON.stringify(removedMembers));
    var members = JSON.parse((0, fs_1.readFileSync)("./storage/member-list.json").toString());
    members.splice(members.indexOf(member.id), 1);
    (0, fs_1.writeFileSync)("./storage/member-list.json", JSON.stringify(members));
}
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
                name: "reject",
                description: "Reject someone's application",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "allow",
                description: "Allow a rejected person to redo their application",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Who is being allowed to redo their application?",
                        type: discord_js_1.ApplicationCommandOptionType.User,
                        required: true,
                    },
                ],
            },
            {
                name: "remove",
                description: "Remove a member from the server",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Who is being removed from the server?",
                        type: discord_js_1.ApplicationCommandOptionType.User,
                        required: true,
                    },
                    {
                        name: "reason-1",
                        description: "Why is this person being removed?",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                    },
                    {
                        name: "reason-2",
                        description: "Why is this person being removed?",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                    },
                    {
                        name: "reason-3",
                        description: "Why is this person being removed?",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                    },
                ],
            },
        ],
    },
    execute: async (client, interaction) => {
        // redirect to correct subcommand
        if (interaction.options.data[0].name === "status")
            statusSubcommand(client, interaction);
        else if (interaction.options.data[0].name === "accept")
            acceptSubcommand(client, interaction);
        else if (interaction.options.data[0].name === "reject")
            rejectSubcommand(client, interaction);
        else if (interaction.options.data[0].name === "allow")
            allowSubcommand(interaction);
        else if (interaction.options.data[0].name === "remove")
            removeSubcommand(client, interaction);
    },
};
//# sourceMappingURL=application.js.map