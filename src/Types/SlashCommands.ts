import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, interaction: ChatInputCommandInteraction);
}

type slashCommandType = {
	data: SlashCommandBuilder;
	execute: Run;
};

export type { slashCommandType };
