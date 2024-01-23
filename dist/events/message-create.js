"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const format = `tellraw @a ["",{"text":"[Discord] ","bold":true,"color":"blue"},{"text":"{username}: ","color":"gray"},{"text":"{message}","color":"white"}]`;
const usernameRegex = /{username}/;
const messageRegex = /{message}/;
const funReplyArray = [
    "Why?",
    "No.",
    "What do you want?",
    "Fuck you.",
    "euphoria.exe stokpped working.",
    "Roger that!",
];
exports.event = {
    name: "messageCreate",
    execute: async (client, message) => {
        // check for bot
        if (message.author.bot || message.webhookId)
            return;
        // checking if it's a SMP/CMP chat message
        if (message.channelId === client.channelSMPchatID) {
            let messageContent = format;
            let username;
            if (typeof message.member?.nickname === "string") {
                username = message.member.nickname;
            }
            else if (message.author.displayName) {
                username = message.author.displayName;
            }
            else
                username = message.author.username;
            messageContent = messageContent.replace(usernameRegex, username);
            messageContent = messageContent.replace(messageRegex, message.content.replaceAll('"', ""));
            await client.SMP.send("send command", [messageContent]);
        }
        else if (message.channelId === client.channelCMPchatID) {
            let messageContent = format;
            let username;
            if (typeof message.member?.nickname === "string") {
                username = message.member.nickname;
            }
            else if (message.author.displayName) {
                username = message.author.displayName;
            }
            else
                username = message.author.username;
            messageContent = messageContent.replace(usernameRegex, username);
            messageContent = messageContent.replace(messageRegex, message.content.replaceAll('"', '\\"'));
            await client.CMP.send("send command", [messageContent]);
        }
        else if (message.content.endsWith("?") || message.mentions.has(client.user)) {
            await message.reply({
                content: funReplyArray[Math.round(Math.random() * (funReplyArray.length - 1))],
            });
        }
    },
};
//# sourceMappingURL=message-create.js.map