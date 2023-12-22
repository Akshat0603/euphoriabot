import { ClientEvents } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, ...args: any[]);
}

type eventType = {
	name: keyof ClientEvents;
	execute: Run;
};

export type { eventType };
