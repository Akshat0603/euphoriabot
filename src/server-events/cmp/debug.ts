import { serverEventsType } from "../../types/server-events";
import myClient from "../../client";

export const event: serverEventsType = {
	name: "debug",
	execute: async (client: myClient, message: string) => console.log(message),
};
