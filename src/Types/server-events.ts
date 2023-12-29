import { WebSocketEvents } from "@devnote-dev/pterojs";
import myClient from "../client";

interface Run {
	(client: myClient, ...args: any[]);
}

type serverEventsType = {
	name: keyof WebSocketEvents;
	execute: Run;
};

export type { serverEventsType };
