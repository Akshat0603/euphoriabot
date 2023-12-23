"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
exports.event = {
    name: "ready",
    execute: (client) => {
        console.log(`${client.user?.username} is online!`);
        client.user?.setActivity({
            name: "Preparing to replace Akshat.",
            type: discord_js_1.ActivityType.Custom,
        });
    },
};
//# sourceMappingURL=ready.js.map