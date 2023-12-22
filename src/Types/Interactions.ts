import { InteractionType } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, ...args: any[]);
}

type interactionType = {
	name: InteractionType;
	execute: Run;
};

export type { interactionType };
