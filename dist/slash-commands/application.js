"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
// ordering the channels
function setPosition(client, channel) {
    const regex = /\d{4}$/;
    const appnum = Number(regex.exec(channel.name)[0]);
    console.log(`[SLASH COMMANDS] Application #${appnum} was responded to.`);
    const category = client.channels.cache.get(client.categoryPastApplications);
    if (!category || category.type !== discord_js_1.ChannelType.GuildCategory) {
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #6`);
        return;
    }
    const channelsCategory = category.children.cache.sort((a, b) => a.position - b.position);
    channelsCategory.forEach((categoryChannel) => {
        channel.setPosition(categoryChannel.position);
    });
}
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
    // checking for currect channel
    if (!doingApp.some((app) => app.ticketID === interaction.channel.id)) {
        await interaction.reply({
            content: "## You cannot use this command in this channel!",
            ephemeral: true,
        });
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
    member.roles.add(client.memberRoleID);
    member.roles.remove(client.waitingRoleID);
    member.setNickname(username);
    client.SMP.send("send command", [`whitelist add ${username}`]);
    client.CMP.send("send command", [`whitelist add ${username}`]);
    doingApp.splice(doingApp.indexOf(doingAppData), 1);
    (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(doingApp));
    var memberList = JSON.parse((0, fs_1.readFileSync)("./storage/member-list.json").toString());
    memberList.push(member.id);
    (0, fs_1.writeFileSync)("./storage/member-list.json", JSON.stringify(memberList));
    const appChannel = client.channels.cache.get(doingAppData.ticketID);
    const channel = client.channels.cache.get(client.channelApplicationResultID);
    // Impossible error check
    if (appChannel.type !== discord_js_1.ChannelType.GuildText || channel.type !== discord_js_1.ChannelType.GuildText) {
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
    appChannel.permissionOverwrites.delete(member.id);
    appChannel.edit({
        parent: client.categoryPastApplications,
        name: appChannel.name.replace("🎫", "✅"),
    });
    setPosition(client, appChannel);
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
    // checking for currect channel
    if (!doingApp.some((app) => app.ticketID === interaction.channel.id)) {
        await interaction.reply({
            content: "## You cannot use this command in this channel!",
            ephemeral: true,
        });
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
    // Impossible error check: code #3
    if (!member) {
        reply.edit({
            content: "An Error Occured! Code #3",
        });
        console.log(`[SLASH COMMANDS] An error occured while executing command "application"! Code #3`);
        return;
    }
    // Changing member roles
    member.roles.remove(client.waitingRoleID);
    doingApp.splice(doingApp.indexOf(doingAppData), 1);
    (0, fs_1.writeFileSync)("./storage/doing-app.json", JSON.stringify(doingApp));
    var rMemberList = JSON.parse((0, fs_1.readFileSync)("./storage/removed-members.json").toString());
    rMemberList.push(member.id);
    (0, fs_1.writeFileSync)("./storage/removed-members.json", JSON.stringify(rMemberList));
    const appChannel = client.channels.cache.get(doingAppData.ticketID);
    const channel = client.channels.cache.get(client.channelApplicationResultID);
    // Impossible error check
    if (appChannel.type !== discord_js_1.ChannelType.GuildText || channel.type !== discord_js_1.ChannelType.GuildText) {
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
    appChannel.permissionOverwrites.delete(member.id);
    appChannel.edit({
        parent: client.categoryPastApplications,
        name: appChannel.name.replace("🎫", "❌"),
    });
    setPosition(client, appChannel);
    await channel.send({ content: `<@${member.id}>`, embeds: [mainEmbed] });
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
    },
};
//# sourceMappingURL=application.js.map