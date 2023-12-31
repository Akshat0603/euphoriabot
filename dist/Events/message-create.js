"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const format = `tellraw @a ["",{"text":"[Discord] ","bold":true,"color":"blue"},{"text":"{username}: ","color":"gray"},{"text":"{message}","color":"white"}]`;
const usernameRegex = /{username}/;
const messageRegex = /{message}/;
exports.event = {
    name: "messageCreate",
    execute: async (client, message) => {
        if (message.channelId === client.channelSMPchatID) {
            let messageContent = format;
            messageContent = messageContent.replace(usernameRegex, message.member.nickname);
            messageContent = messageContent.replace(messageRegex, message.content);
            await client.SMP.send("send command", [messageContent]);
        }
        else if (message.channelId === client.channelCMPchatID) {
            let messageContent = format;
            messageContent = messageContent.replace(usernameRegex, message.member.nickname);
            messageContent = messageContent.replace(messageRegex, message.content);
            await client.CMP.send("send command", [messageContent]);
        }
    },
};
//# sourceMappingURL=message-create.js.map