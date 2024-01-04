import {
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import myClient from "../client";
import { slashCommandType } from "../types/slash-commands";
import { appSettingsObject } from "../types/application-settings";
import { readFileSync, writeFileSync } from "fs";

async function statusSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {
	const reply = await interaction.deferReply({ ephemeral: true });
	const newStatus = interaction.options.data[1].value === "open" ? true : false;
	var appSettings: appSettingsObject = JSON.parse(
		readFileSync("./storage/app-settings.json").toString()
	);

	// Checking if status is same
	if (appSettings.open === newStatus) {
		await reply.edit({
			content: `## Applications are already ${newStatus === true ? "open" : "closed"}!`,
		});
		return;
	} else appSettings.open = newStatus;

	// Getting previous message
	const channel = client.channels.cache.get(client.channelApplyID);
	if (channel!.type !== ChannelType.GuildText) {
		await reply.edit({ content: "An Error Occured! Code #1" });
		console.log(
			`[SLASH COMMANDS] An error occured while executing command "application"! Code #1`
		);
		return;
	}
	const messages = await channel.messages.fetch();
	const msg = messages.get(appSettings.messageID);
	await msg?.delete();

	// Changing the status
	const message = await channel.send({
		content:
			appSettings.open === true
				? "# <:yes:1181140152333115442> Applications Open! <:yes:1181140152333115442>"
				: "# <:no:1181140154623213569> Applications Closed! <:no:1181140154623213569>",
	});
	appSettings.messageID = message.id;

	writeFileSync("./storage/app-settings.json", JSON.stringify(appSettings));
	await reply.edit({ content: "Done" });
}

async function acceptSubcommand(client: myClient, interaction: ChatInputCommandInteraction) {}

async function denySubcommand(client: myClient, interaction: ChatInputCommandInteraction) {}

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "application",
		description: "Control the application system of the server",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		options: [
			{
				name: "status",
				description: "Open or Close the applications of the server",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "input",
						description: "Input field to open/close.",
						type: ApplicationCommandOptionType.String,
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
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "username",
						description: "Minecraft username of the person being accepted.",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "deny",
				description: "Deny someone's application",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		// redirect to correct subcommand
		console.log(interaction.options.data[0]);
		if (interaction.options.data[0].name === "status") statusSubcommand(client, interaction);
		else if (interaction.options.data[0].name === "accept")
			acceptSubcommand(client, interaction);
		else if (interaction.options.data[0].name === "deny") denySubcommand(client, interaction);
	},
};
