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
import { SlashCommandDescriptor } from "../builder/slash-command.descriptor";
import { EuphoriaSlashCommandBuilder } from "../builder/euphoria-slash-command.builder";
import { describe } from "node:test";

export const WhitelistCommand: SlashCommandDescriptor = {
  name: "whitelist",
  description: "Officially control the whitelist of the server.",
  permission: PermissionFlagsBits.Administrator,
  subCommands: [
    {
      name: "add",
      description: "Officially adds someone to the whitelist of the server.",
      parameters: [
        {
          type: "user",
          name: "user-mention",
          description: "Who on discord is being whitelisted?",
          required: true,
        },
        {
          type: "string",
          name: "minecraft-username",
          description: "What is the username of the person being whitelisted?",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description:
        "Officially removes someone from the whitelist of the server.",
      parameters: [
        {
          type: "user",
          name: "user-mention",
          description: "Who on discord is being whitelisted?",
          required: true,
        },
        {
          type: "string",
          name: "minecraft-username",
          description: "What is the username of the person being whitelisted?",
          required: true,
        },
      ],
    },
  ],
};

const commandData = EuphoriaSlashCommandBuilder.build(WhitelistCommand);

const run = {
	add: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const response = await interaction.deferReply();

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
			response.edit({
				content: "You cannot add a bot to the whitelist!",
			});
			return;
		}

		const rcon1 = await Rcon.connect(client.rconCMP);
		const rcon2 = await Rcon.connect(client.rconSMP);

		const response1 = await rcon1.send(`whitelist add ${optionsUsername.value}`);
		const response2 = await rcon2.send(`whitelist add ${optionsUsername.value}`);

		rcon1.end();
		rcon2.end();

		response.edit({
			content: `
### Response from CMP:
${response1}
### Response from SMP:
${response2}`,
		});
	},
	remove: async (client: myClient, interaction: ChatInputCommandInteraction) => {
		const response = await interaction.deferReply();

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

		response.edit({
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
