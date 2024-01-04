"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const get_all_files_1 = require("./utilities/get-all-files");
const path_1 = require("path");
require("dotenv/config");
const pterojs_1 = require("@devnote-dev/pterojs");
class myClient extends discord_js_1.Client {
    // EMPTY IDENTIFICATION
    slashCommands = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    SMPEvents = new discord_js_1.Collection();
    CMPEvents = new discord_js_1.Collection();
    Buttons = new discord_js_1.Collection();
    // SIMPLE DATA IDENTIFICATION
    guildID = "1176560748642709595";
    channelEuphoriaID = "1176817932693688390";
    channelSMPchatID = "1190355602908663981";
    channelCMPchatID = "1190355741631053834";
    channelLogMessageDeleteID = "1187721538779238471";
    channelLogMessageUpdateID = "1187721577253584956";
    channelMemberListID = "1177882289116561510";
    channelApplyID = "1176815969025396807";
    channelApplicationResultID = "1176839407391752222";
    memberRoleID = "1176812990574637086";
    removedRoleID = "1179056413964771369";
    messageMemberListID = "1192011933914759198";
    messageModsID = "1179369602652848160";
    embedFooter = {
        text: "Looking for the timestamp? GET LOST!",
    };
    // COMPLEX DATA IDENTIFICATION
    SMPchatWebhook = new discord_js_1.WebhookClient({
        url: "https://discord.com/api/webhooks/1190670638248099850/sZYGnFFdXLf9h4e2dB8-dkgVWZe4SpB0bUpy1FEQ3QVVWgQa0p2Bl9QLloKOr__sDcui",
    });
    CMPchatWebhook = new discord_js_1.WebhookClient({
        url: "https://discord.com/api/webhooks/1190670729327411201/tKg5nLhWLQ_FIGson-IKfgTFSxBe8UpJDDINbUi40AOk7n9yMkuz2rx58UoNBaFXBWUo",
    });
    panelClient = new pterojs_1.PteroClient("https://panel.euphoriasmp.com/", process.env.PTEROAPI);
    SMP = this.panelClient.addSocketServer("d07e9ba3");
    CMP = this.panelClient.addSocketServer("cf23cd0c");
    // INITIALIZE THE BOT
    async init(dir) {
        // Register Slash Commands (Load to client in event: 'ready')
        const slashCommandsPath = (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "slash-commands"));
        for (const slashCommandPath of slashCommandsPath) {
            let Command;
            var { slashCommand } = await require(slashCommandPath);
            if (slashCommand && slashCommand.data && slashCommand.execute) {
                Command = slashCommand;
                this.slashCommands.set(Command.data.name, slashCommand);
                console.log(`[REGISTRY] Slash Command Registered: '${Command.data.name}'`);
            }
            else {
                console.warn(`[WARNING] Slash Command at path '${slashCommandPath}' is invalid!`);
            }
        }
        // Get and Register Events
        const eventsPath = (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "events"));
        for (const eventPath of eventsPath) {
            const { event } = await require(eventPath);
            if (event && event.name && event.execute) {
                this.events.set(event.name, event);
                this.on(event.name, event.execute.bind(null, this));
                console.log(`[REGISTRY] Event Registed: '${event.name}'`);
            }
            else {
                console.warn(`[WARNING] Event at path '${eventPath}' is invalid!`);
            }
        }
        // Get and Register Components
        const ComponentsPath = (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "components"), 1);
        for (const componentPath of ComponentsPath) {
            const pathDir = componentPath.split("\\");
            const component = pathDir[pathDir.length - 2];
            if (component === "buttons") {
                const { button } = await require(componentPath);
                if (button && button.customID && button.execute) {
                    this.Buttons.set(button.customID, button);
                    console.log(`[REGISTRY] Button Registered: '${button.customID}'`);
                }
                else
                    console.warn(`[WARNING] Button at path '${componentPath}' is invalid!`);
            }
            else
                console.warn(`[WARNING] ${component.toUpperCase() || "Unknown"} at path '${componentPath} is invalid!`);
        }
        // Get and Register Minecraft Server Events
        const ServerEventsPath = (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "server-events"), 1);
        for (const eventPath of ServerEventsPath) {
            const pathDir = eventPath.split("\\");
            const server = pathDir[pathDir.length - 2];
            const { event } = await require(eventPath);
            if (event && event.name && event.execute) {
                if (server === "smp") {
                    this.SMPEvents.set(event.name, event);
                    this.SMP.on(event.name, event.execute.bind(null, this));
                }
                else if (server === "cmp") {
                    this.CMPEvents.set(event.name, event);
                    this.CMP.on(event.name, event.execute.bind(null, this));
                }
                else
                    console.warn(`[WARNING] ${server.toUpperCase() || "Unknown"} at path '${eventPath}' is invalid!`);
                console.log(`[REGISTRY] ${server.toUpperCase()} Event Registed: '${event.name}'`);
            }
            else {
                console.warn(`[WARNING] ${server.toUpperCase() || "Unknown"} event at path '${eventPath}' is invalid!`);
            }
        }
        // Login (MC Server connect in client event: 'ready')
        this.login(process.env.TOKEN);
        this.SMP.origin = true;
        this.CMP.origin = true;
    }
}
exports.default = myClient;
//# sourceMappingURL=client.js.map