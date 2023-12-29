"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const choices = [
    {
        name: "Denied",
        value: "Denied",
    },
    {
        name: "Planned",
        value: "Planned",
    },
    {
        name: "Implemented",
        value: "Implemented",
    },
    {
        name: "On Hold",
        value: "On Hold",
    },
];
exports.slashCommand = {
    data: {
        name: "suggestion",
        description: "Set the status of a suggestion.",
        defaultMemberPermissions: discord_js_1.PermissionFlagsBits.Administrator,
        options: [
            {
                name: "status",
                description: "What's the new status?",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
                choices: choices,
            },
            {
                name: "close-post",
                description: "Do you wanna close the post? Default: False",
                type: discord_js_1.ApplicationCommandOptionType.Boolean,
            },
        ],
    },
    execute: async (client, interaction) => {
        if (interaction.channel.type !== discord_js_1.ChannelType.PublicThread ||
            interaction.channel?.parentId !== "1176818908909551646") {
            await interaction.reply({
                content: "This command is not to be used in this channel!",
                ephemeral: true,
            });
            return;
        }
        const response = await interaction.deferReply();
        if (interaction.options.data[0].type !== discord_js_1.ApplicationCommandOptionType.String) {
            response.edit({ content: "## <:no:1181140154623213569> An Error Occured! Code #6" });
            return;
        }
        var newStatus = interaction.options.data[0].value;
        var closePost = false;
        if (interaction.options.data[1]) {
            if (interaction.options.data[1].type !== discord_js_1.ApplicationCommandOptionType.Boolean ||
                typeof interaction.options.data[1].value !== "boolean") {
                response.edit({
                    content: "## <:no:1181140154623213569> An Error Occured! Code #7",
                });
                return;
            }
            closePost = interaction.options.data[1].value;
        }
        const channel = client.channels.cache.get(interaction.channel.parentId);
        if (channel.type !== discord_js_1.ChannelType.GuildForum) {
            response.edit({ content: "## <:no:1181140154623213569> An Error Occured! Code #8" });
            return;
        }
        const newStatusID = channel.availableTags.filter((t) => t.name === newStatus)[0].id;
        var tags = interaction.channel.appliedTags;
        tags.forEach((t) => {
            if (t === newStatusID) {
                response.edit({
                    content: "You cannot change the status of this post to an already set status!",
                });
                return;
            }
        });
        var allOptionsID = [];
        choices.forEach((c) => {
            allOptionsID.push(channel.availableTags.filter((t) => t.name === c.value)[0].id);
        });
        allOptionsID.forEach((id) => {
            if (tags.includes(id)) {
                const index = tags.indexOf(id);
                tags.splice(index);
            }
        });
        tags.push(newStatusID);
        interaction.channel.edit({ appliedTags: tags });
        response.edit({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL({ extension: "jpg" }),
                })
                    .setColor("#b700ff")
                    .setTitle(`The status of this channel has been changed to \`${newStatus}\`!`)
                    .setFooter(client.embedFooter),
            ],
        });
        if (closePost === true) {
            interaction.channel.setArchived(true);
        }
    },
};
//# sourceMappingURL=suggestion.js.map