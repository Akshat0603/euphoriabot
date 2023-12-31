"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const get_all_files_1 = require("./utilities/get-all-files");
const path_1 = require("path");
require("dotenv/config");
const pterojs_1 = require("@devnote-dev/pterojs");
class myClient extends discord_js_1.Client {
    slashCommands = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    SMPEvents = new discord_js_1.Collection();
    CMPEvents = new discord_js_1.Collection();
    clientId = "1185165875301584956";
    guildId = "1176560748642709595";
    SMPwebhookLink = "https://discord.com/api/webhooks/1190670638248099850/sZYGnFFdXLf9h4e2dB8-dkgVWZe4SpB0bUpy1FEQ3QVVWgQa0p2Bl9QLloKOr__sDcui";
    CMPwebhookLink = "https://discord.com/api/webhooks/1190670729327411201/tKg5nLhWLQ_FIGson-IKfgTFSxBe8UpJDDINbUi40AOk7n9yMkuz2rx58UoNBaFXBWUo";
    channelEuphoriaID = "1176817932693688390";
    channelSMPchatID = "1190355602908663981";
    channelCMPchatID = "1190355741631053834";
    channelLogMessageDeleteID = "1187721538779238471";
    channelLogMessageUpdateID = "1187721577253584956";
    memberRoleID = "1176812990574637086";
    messageModsID = "1179369602652848160";
    messageModsContentStart = "# __Server Mods__";
    embedFooter = {
        text: "Looking for the timestamp? GET LOST!",
    };
    SMPchatWebhook = new discord_js_1.WebhookClient({ url: this.SMPwebhookLink });
    CMPchatWebhook = new discord_js_1.WebhookClient({ url: this.CMPwebhookLink });
    panelClient = new pterojs_1.PteroClient("https://panel.euphoriasmp.com/", process.env.PTEROAPI);
    SMP = this.panelClient.addSocketServer("d07e9ba3");
    CMP = this.panelClient.addSocketServer("cf23cd0c");
    async init(dir) {
        const slashCommandsPath = await (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "slash-commands"));
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
        const eventsPath = await (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "events"));
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
        const SMPEventsPath = await (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "server-events/smp"));
        for (const eventPath of SMPEventsPath) {
            const { event } = await require(eventPath);
            if (event && event.name && event.execute) {
                this.SMPEvents.set(event.name, event);
                this.SMP.on(event.name, event.execute.bind(null, this));
                console.log(`[REGISTRY] SMP Event Registed: '${event.name}'`);
            }
            else {
                console.warn(`[WARNING] SMP Event at path '${eventPath}' is invalid!`);
            }
        }
        const CMPEventsPath = await (0, get_all_files_1.getAllFiles)((0, path_1.join)(dir, "server-events/cmp"));
        for (const eventPath of CMPEventsPath) {
            const { event } = await require(eventPath);
            if (event && event.name && event.execute) {
                this.CMPEvents.set(event.name, event);
                this.CMP.on(event.name, event.execute.bind(null, this));
                console.log(`[REGISTRY] CMP Event Registed: '${event.name}'`);
            }
            else {
                console.warn(`[WARNING] CMP Event at path '${eventPath}' is invalid!`);
            }
        }
        this.login(process.env.TOKEN);
        this.SMP.origin = true;
        this.CMP.origin = true;
    }
}
exports.default = myClient;
//# sourceMappingURL=client.js.map