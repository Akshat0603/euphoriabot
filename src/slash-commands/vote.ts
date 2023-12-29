/* import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} from "discord.js";
import { slashCommandType } from "../Types/SlashCommands";
import myClient from "../client";

// -> vote create <yes-no / multiple-choice>
// vote delete <messageID>
// vote end <messageID>
// vote get [messageID]
// vote set <number>

export const slashCommand: slashCommandType = {
	// COMMAND DATA
	data: {
		name: "vote",
		description: "Control the voting system",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		options: [
			{
				name: "create",
				description: "Create a new vote",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "vote-type",
						description: "What kind of vote is this? Yes-No OR Multiple-Choice?",
						type: ApplicationCommandOptionType.String,
                        required: true,
						choices: [
							{
								name: "Yes-No",
								value: "yn",
							},
							{
								name: "Multiple-Choice",
								value: "mc",
							},
						],
					},
                    {
                        name: 'ping',
                        description: 'Whether to ping Euphorians or not. (Ghost ping) Default: False',
                        type: ApplicationCommandOptionType.Boolean
                    }
				],
			},
		],
	},

	// COMMAND EXECUTION
	execute: async (client: myClient, interaction: ChatInputCommandInteraction) => {},
};
 */
