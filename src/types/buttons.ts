import { ButtonInteraction } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, interaction: ButtonInteraction);
}

export type buttonType = {
	customID: string;
	execute: Run;
};
