import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, interaction: ChatInputCommandInteraction);
}

export type slashCommandType = {
	data: ChatInputApplicationCommandData;
	execute: Run;
};
