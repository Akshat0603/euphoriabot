"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getAllFiles_1 = __importDefault(require("./Utilities/getAllFiles"));
const path_1 = require("path");
require("dotenv/config");
class myClient extends discord_js_1.Client {
    slashCommands = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    slashCommandsJSONArray = new Array();
    rest = new discord_js_1.REST().setToken(process.env.TOKEN);
    rconSMP = {
        port: Number(process.env.PORTSMP),
        host: process.env.SERVERIP,
        password: process.env.RCONPASS,
    };
    rconCMP = {
        port: Number(process.env.PORTCMP),
        host: process.env.SERVERIP,
        password: process.env.RCONPASS,
    };
    clientId = "1185165875301584956";
    guildId = "1176560748642709595";
    channelEuphoriaID = "1176817932693688390";
    channelLogMessageDeleteID = "1187721538779238471";
    channelLogMessageUpdateID = "1187721577253584956";
    messageModsID = "1179369602652848160";
    messageModsContentStart = "# __Server Mods__";
    embedFooter = {
        text: "Looking for the timestamp? GET LOST!",
    };
    async init(dir) {
        this.login(process.env.TOKEN);
        const slashCommandsPath = await (0, getAllFiles_1.default)((0, path_1.join)(dir, "SlashCommands"));
        for (const slashCommandPath of slashCommandsPath) {
            let Command;
            var { slashCommand } = await require(slashCommandPath);
            if (slashCommand.data && slashCommand.execute) {
                Command = slashCommand;
                this.slashCommandsJSONArray.push(Command.data.toJSON());
                this.slashCommands.set(Command.data.name, slashCommand);
                console.log(`[REGISTRY] Slash Command Registered: ${Command.data.name}`);
            }
            else {
                console.warn(`[WARNING] Slash Command at path ${slashCommandPath} is invalid!`);
            }
        }
        try {
            console.log(`[SLASH COMMANDS] Started refreshing ${this.slashCommandsJSONArray.length} application (/) commands.`);
            const data = await this.rest.put(discord_js_1.Routes.applicationGuildCommands(this.clientId, this.guildId), { body: this.slashCommandsJSONArray });
            console.log(`[SLASH COMMANDS] Refreshed ${this.slashCommandsJSONArray.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
        const eventsPath = await (0, getAllFiles_1.default)((0, path_1.join)(dir, "Events"));
        for (const eventPath of eventsPath) {
            const { event } = await require(eventPath);
            if (event && event.name && event.execute) {
                this.events.set(event.name, event);
                this.on(event.name, event.execute.bind(null, this));
                console.log(`[REGISTRY] Event Registed: ${event.name}`);
            }
            else {
                console.warn(`[WARNING] Event at path ${eventPath} is invalid!`);
            }
        }
    }
}
exports.default = myClient;
//# sourceMappingURL=client.js.map