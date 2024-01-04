import { Client, Collection, EmbedFooterOptions, TextChannel, WebhookClient } from "discord.js";
import { slashCommandType } from "./types/slash-commands";
import { eventType } from "./types/events";
import { getAllFiles } from "./utilities/get-all-files";
import { join } from "path";
import "dotenv/config";
import { PteroClient, Shard } from "@devnote-dev/pterojs";
import { serverEventsType } from "./types/server-events";
import { buttonType } from "./types/buttons";

class myClient extends Client {
	// EMPTY IDENTIFICATION
	public slashCommands: Collection<string, slashCommandType> = new Collection();
	public events: Collection<string, eventType> = new Collection();
	public SMPEvents: Collection<string, serverEventsType> = new Collection();
	public CMPEvents: Collection<string, serverEventsType> = new Collection();
	public Buttons: Collection<string, buttonType> = new Collection();

	// SIMPLE DATA IDENTIFICATION
	public guildID: string = "1176560748642709595";

	public channelEuphoriaID: string = "1176817932693688390";
	public channelSMPchatID: string = "1190355602908663981";
	public channelCMPchatID: string = "1190355741631053834";
	public channelLogMessageDeleteID: string = "1187721538779238471";
	public channelLogMessageUpdateID: string = "1187721577253584956";
	public channelMemberListID: string = "1177882289116561510";
	public channelApplyID: string = "1176815969025396807";
	public channelApplicationResultID: string = "1176839407391752222";

	public memberRoleID: string = "1176812990574637086";
	public removedRoleID: string = "1179056413964771369";

	public messageMemberListID: string = "1192011933914759198";
	public messageModsID: string = "1179369602652848160";

	public embedFooter: EmbedFooterOptions = {
		text: "Looking for the timestamp? GET LOST!",
	};

	// COMPLEX DATA IDENTIFICATION
	public SMPchatWebhook: WebhookClient = new WebhookClient({
		url: "https://discord.com/api/webhooks/1190670638248099850/sZYGnFFdXLf9h4e2dB8-dkgVWZe4SpB0bUpy1FEQ3QVVWgQa0p2Bl9QLloKOr__sDcui",
	});
	public CMPchatWebhook: WebhookClient = new WebhookClient({
		url: "https://discord.com/api/webhooks/1190670729327411201/tKg5nLhWLQ_FIGson-IKfgTFSxBe8UpJDDINbUi40AOk7n9yMkuz2rx58UoNBaFXBWUo",
	});

	public panelClient: PteroClient = new PteroClient(
		"https://panel.euphoriasmp.com/",
		process.env.PTEROAPI!
	);
	public SMP: Shard = this.panelClient.addSocketServer("d07e9ba3");
	public CMP: Shard = this.panelClient.addSocketServer("cf23cd0c");

	// INITIALIZE THE BOT
	public async init(dir: string) {
		// Register Slash Commands (Load to client in event: 'ready')
		const slashCommandsPath = getAllFiles(join(dir, "slash-commands"));
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

		// Get and Register Events
		const eventsPath = getAllFiles(join(dir, "events"));
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

		// Get and Register Components
		const ComponentsPath = getAllFiles(join(dir, "components"), 1);
		for (var componentPath of ComponentsPath) {
			componentPath = componentPath.replace("\\", "/");
			const pathDir = componentPath.split("/");
			const component = pathDir[pathDir.length - 2];

			if (component === "buttons") {
				const { button } = await require(componentPath);
				if (button && button.customID && button.execute) {
					this.Buttons.set(button.customID, button);
					console.log(`[REGISTRY] Button Registered: '${button.customID}'`);
				} else console.warn(`[WARNING] Button at path '${componentPath}' is invalid!`);
			} else
				console.warn(
					`[WARNING] ${
						component?.toUpperCase() || "Unknown"
					} at path '${componentPath} is invalid!`
				);
		}

		// Get and Register Minecraft Server Events
		const ServerEventsPath = getAllFiles(join(dir, "server-events"), 1);
		for (var eventPath of ServerEventsPath) {
			eventPath = eventPath.replaceAll("\\", "/");
			const pathDir = eventPath.split("/");
			const server = pathDir[pathDir.length - 2];

			const { event } = await require(eventPath);

			if (event && event.name && event.execute) {
				if (server === "smp") {
					this.SMPEvents.set(event.name, event);
					this.SMP.on(event.name, event.execute.bind(null, this));
				} else if (server === "cmp") {
					this.CMPEvents.set(event.name, event);
					this.CMP.on(event.name, event.execute.bind(null, this));
				} else
					console.warn(
						`[WARNING] ${
							server.toUpperCase() || "Unknown"
						} at path '${eventPath}' is invalid!`
					);
				console.log(`[REGISTRY] ${server.toUpperCase()} Event Registed: '${event.name}'`);
			} else {
				console.warn(
					`[WARNING] ${
						server?.toUpperCase() || "Unknown"
					} event at path '${eventPath}' is invalid!`
				);
			}
		}

		// Login (MC Server connect in client event: 'ready')
		this.login(process.env.TOKEN);
		this.SMP.origin = true;
		this.CMP.origin = true;
	}
}

export default myClient;
