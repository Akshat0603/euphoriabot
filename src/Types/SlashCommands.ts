import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, interaction: ChatInputCommandInteraction);
}

type slashCommandType = {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	execute: Run;
};

export type { slashCommandType };
