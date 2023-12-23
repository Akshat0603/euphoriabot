import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandUserOption,
} from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";
import { Rcon } from "rcon-client";

const commandDataSubcommandOptions = {
	userOption: new SlashCommandUserOption()
		.setName("user-mention")
		.setDescription("Who on discord is being whitelisted?")
		.setRequired(true),
	usernameOption: new SlashCommandStringOption()
		.setName("minecraft-username")
		.setDescription("What is the username of the person being whitelisted?")
		.setRequired(true),
};

const commandDataSubcommands = {
	add: new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Officially adds someone to the whitelist of the server.")
		.addUserOption(commandDataSubcommandOptions.userOption)
		.addStringOption(commandDataSubcommandOptions.usernameOption),
	remove: new SlashCommandSubcommandBuilder()
		.setName("remove")
		.setDescription("Officially removes someone from the whitelist of the server.")
		.addUserOption(commandDataSubcommandOptions.userOption)
		.addStringOption(commandDataSubcommandOptions.usernameOption),
};

const commandData = new SlashCommandBuilder()
	.setName("whitelist")
	.setDescription("Officially control the whitelist of the server.")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(commandDataSubcommands.add)
	.addSubcommand(commandDataSubcommands.remove);

const run = {
	add: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const optionsUser = interaction.options.data[0].options![0];
		const optionsUsername = interaction.options.data[0].options![1];

		if (
			optionsUser.type !== ApplicationCommandOptionType.User ||
			optionsUsername.type !== ApplicationCommandOptionType.String
		) {
			interaction.reply({
				content: "## <:no:1181140154623213569> An Error Occured! Code #4",
				ephemeral: true,
			});
			return;
		}
		if (optionsUser.user!.bot) {
			interaction.reply({
				content: "You cannot add a bot to the whitelist!",
				ephemeral: true,
			});
			return;
		}

		const rcon1 = await Rcon.connect(client.rconCMP);
		const rcon2 = await Rcon.connect(client.rconSMP);

		const response1 = await rcon1.send(`whitelist add ${optionsUsername.value}`);
		const response2 = await rcon2.send(`whitelist add ${optionsUsername.value}`);

		rcon1.end();
		rcon2.end();

		interaction.reply({
			content: `
### Response from CMP:
${response1}
### Response from SMP:
${response2}`,
		});
	},
	remove: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const optionsUser = interaction.options.data[0].options![0];
		const optionsUsername = interaction.options.data[0].options![1];

		if (
			optionsUser.type !== ApplicationCommandOptionType.User ||
			optionsUsername.type !== ApplicationCommandOptionType.String
		) {
			interaction.reply({
				content: "## <:no:1181140154623213569> An Error Occured! Code #5",
				ephemeral: true,
			});
			return;
		}

		const rcon1 = await Rcon.connect(client.rconCMP);
		const rcon2 = await Rcon.connect(client.rconSMP);

		const response1 = await rcon1.send(`whitelist remove ${optionsUsername.value}`);
		const response2 = await rcon2.send(`whitelist remove ${optionsUsername.value}`);

		rcon1.end();
		rcon2.end();

		interaction.reply({
			content: `
### Response from CMP:
${response1}
### Response from SMP:
${response2}`,
		});
	},
};

export const slashCommand: slashCommandType = {
	data: commandData,
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		if (interaction.options.data[0].name === "add") {
			console.log(
				`[SLASH COMMANDS] Executed Subcommand "add" by ${interaction.user.username}`
			);
			run.add(client, interaction);
		} else if (interaction.options.data[0].name === "remove") {
			console.log(
				`[SLASH COMMANDS] Executed Subcommand "remove" by ${interaction.user.username}`
			);
			run.remove(client, interaction);
		} else
			interaction.reply({
				content: "## <:no:1181140154623213569> An Error Occured! Code #3",
				ephemeral: true,
			});
	},
};
