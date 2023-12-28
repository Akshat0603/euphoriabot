import { Client, Collection, EmbedFooterOptions } from "discord.js";
import { slashCommandType } from "./Types/SlashCommands";
import { eventType } from "./Types/Events";
import getAllFiles from "./Utilities/getAllFiles";
import { join } from "path";
import "dotenv/config";
import { RconOptions } from "rcon-client";

class myClient extends Client {
	// EMPTY IDENTIFICATION
	public slashCommands: Collection<string, slashCommandType> = new Collection();
	public events: Collection<string, eventType> = new Collection();

	// COMPLEX DATA IDENTIFICATION
	public rconSMP: RconOptions = {
		port: Number(process.env.PORTSMP!),
		host: process.env.SERVERIP!,
		password: process.env.RCONPASS!,
	};
	public rconCMP: RconOptions = {
		port: Number(process.env.PORTCMP!),
		host: process.env.SERVERIP!,
		password: process.env.RCONPASS!,
	};

	// SIMPLE DATA IDENTIFICATION
	public clientId = "1185165875301584956";
	public guildId = "1176560748642709595";

	public channelEuphoriaID = "1176817932693688390";
	public channelLogMessageDeleteID = "1187721538779238471";
	public channelLogMessageUpdateID = "1187721577253584956";

	public messageModsID = "1179369602652848160";
	public messageModsContentStart = "# __Server Mods__";

	public embedFooter: EmbedFooterOptions = {
		text: "Looking for the timestamp? GET LOST!",
	};

	// INITIALIZE THE BOT
	public async init(dir: string) {
		// LOGIN
		this.login(process.env.TOKEN);

		// REGISTER SLASH COMMANDS (Load to client in event: 'ready')
		const slashCommandsPath = await getAllFiles(join(dir, "SlashCommands"));
		for (const slashCommandPath of slashCommandsPath) {
			let Command: slashCommandType;
			var { slashCommand } = await require(slashCommandPath);
			if (slashCommand && slashCommand.data && slashCommand.execute) {
				Command = slashCommand;
				this.slashCommands.set(Command.data.name, slashCommand);
				console.log(`[REGISTRY] Slash Command Registered: '${Command.data.name}'`);
			} else {
				console.warn(`[WARNING] Slash Command at path '${slashCommandPath}' is invalid!`);
			}
		}

		// GET AND REGISTER EVENTS
		const eventsPath = await getAllFiles(join(dir, "Events"));
		for (const eventPath of eventsPath) {
			const { event } = await require(eventPath);
			if (event && event.name && event.execute) {
				this.events.set(event.name, event);
				this.on(event.name, event.execute.bind(null, this));
				console.log(`[REGISTRY] Event Registed: '${event.name}'`);
			} else {
				console.warn(`[WARNING] Event at path '${eventPath}' is invalid!`);
			}
		}
	}
}

export default myClient;
