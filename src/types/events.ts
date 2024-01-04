import { ClientEvents } from "discord.js";
import myClient from "../client";

interface Run {
	(client: myClient, ...args: any[]);
}

export type eventType = {
	name: keyof ClientEvents;
	execute: Run;
};
