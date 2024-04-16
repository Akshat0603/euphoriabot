import {
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import { slashCommandType } from "../types/slash-commands";
import myClient from "../client";

// STATUS CHOICES
const choices: readonly ApplicationCommandOptionChoiceData<string>[] = [
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
	{
		name: "Duplicate",
		value: "Duplicate",
	},
];

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "suggestion",
		description: "Set the status of a suggestion.",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		options: [
			{
				name: "status",
				description: "What's the new status?",
				type: ApplicationCommandOptionType.String,
				required: true,
				choices: choices,
			},
			{
				name: "close-post",
				description: "Do you wanna close the post? Default: False",
				type: ApplicationCommandOptionType.Boolean,
			},
		],
	},

	// COMMAND EXECUTION
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		// Checking for correct channel
		if (
			interaction.channel!.type !== ChannelType.PublicThread ||
			interaction.channel?.parentId !== client.forumSuggestionID
		) {
			await interaction.reply({
				content: "This command is not to be used in this channel!",
				ephemeral: true,
			});
			return;
		}

		// Deferring reply for processing time
		const response = await interaction.deferReply();

		// Impossible error check: Code #6
		if (interaction.options.data[0].type !== ApplicationCommandOptionType.String) {
			response.edit({ content: "## <:no:1181140154623213569> An Error Occured! Code #6" });
			return;
		}

		// Assigning values
		var newStatus = interaction.options.data[0].value;
		var closePost = false;

		// Checking for close-post
		if (interaction.options.data[1]) {
			// Impossible error check: Code #7
			if (
				interaction.options.data[1].type !== ApplicationCommandOptionType.Boolean ||
				typeof interaction.options.data[1].value !== "boolean"
			) {
				await response.edit({
					content: "## <:no:1181140154623213569> An Error Occured! Code #7",
				});
				return;
			}

			closePost = interaction.options.data[1].value;
		}

		// Getting Parent Channel for ease of access
		const channel = client.channels.cache.get(interaction.channel.parentId);

		// Impossible error check: Code #8
		if (channel!.type !== ChannelType.GuildForum) {
			await response.edit({content: "## <:no:1181140154623213569> An Error Occured! Code #8"});
			return;
		}

		// Tag check and modification from this point forth
		const newStatusID = channel.availableTags.filter((t) => t.name === newStatus)[0].id;
		var tags = interaction.channel.appliedTags;
		var shallReturn: number = 0;

		tags.forEach((t) => {
			if (t === newStatusID) {
				response.edit({
					content: "You cannot change the status of this post to an already set status!",
				});
				shallReturn = 1;
			}
		});
		if (shallReturn === 1) return;

		var allOptionsID: string[] = [];

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

		// Tag modification complete. Applying changes and responding to user
		interaction.channel.edit({ appliedTags: tags });
		await response.edit({
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name: interaction.user.username,
						iconURL: interaction.user.avatarURL({extension: "jpg"})!,
					})
					.setColor("#b700ff")
					.setTitle(`The status of this channel has been changed to \`${newStatus}\`!`)
					.setFooter(client.embedFooter),
			],
		});

		// Closing post if needed
		if (closePost === true) {
			interaction.channel.setArchived(true);
		}
	},
};
