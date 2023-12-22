import { SlashCommandBuilder } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, ...args: any[]);
}

type slashCommandType = {
	data: SlashCommandBuilder;
	execute: Run;
};

export type { slashCommandType };
