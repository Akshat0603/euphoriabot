"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
const rcon_client_1 = require("rcon-client");
const commandDataSubcommandOptions = {
    userOption: new discord_js_1.SlashCommandUserOption()
        .setName("user-mention")
        .setDescription("Who on discord is being whitelisted?")
        .setRequired(true),
    usernameOption: new discord_js_1.SlashCommandStringOption()
        .setName("minecraft-username")
        .setDescription("What is the username of the person being whitelisted?")
        .setRequired(true),
};
const commandDataSubcommands = {
    add: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Officially adds someone to the whitelist of the server.")
        .addUserOption(commandDataSubcommandOptions.userOption)
        .addStringOption(commandDataSubcommandOptions.usernameOption),
    remove: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Officially removes someone from the whitelist of the server.")
        .addUserOption(commandDataSubcommandOptions.userOption)
        .addStringOption(commandDataSubcommandOptions.usernameOption),
};
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Officially control the whitelist of the server.")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addSubcommand(commandDataSubcommands.add)
    .addSubcommand(commandDataSubcommands.remove);
const run = {
    add: async (client, interaction) => {
        const response = await interaction.deferReply();
        const optionsUser = interaction.options.data[0].options[0];
        const optionsUsername = interaction.options.data[0].options[1];
        if (optionsUser.type !== discord_js_1.ApplicationCommandOptionType.User ||
            optionsUsername.type !== discord_js_1.ApplicationCommandOptionType.String) {
            interaction.reply({
                content: "## <:no:1181140154623213569> An Error Occured! Code #4",
                ephemeral: true,
            });
            return;
        }
        if (optionsUser.user.bot) {
            interaction.reply({
                content: "You cannot add a bot to the whitelist!",
                ephemeral: true,
            });
            return;
        }
        const rcon1 = await rcon_client_1.Rcon.connect(client.rconCMP).catch((err) => console.error(err));
        const response1 = await rcon1.send(`whitelist add ${optionsUsername.value}`);
        rcon1.end();
        response.edit({
            content: `
### Response from CMP:
${response1}
### Response from SMP:
disabled`,
        });
    },
    remove: async (client, interaction) => {
        const response = await interaction.deferReply();
        const optionsUser = interaction.options.data[0].options[0];
        const optionsUsername = interaction.options.data[0].options[1];
        if (optionsUser.type !== discord_js_1.ApplicationCommandOptionType.User ||
            optionsUsername.type !== discord_js_1.ApplicationCommandOptionType.String) {
            interaction.reply({
                content: "## <:no:1181140154623213569> An Error Occured! Code #5",
                ephemeral: true,
            });
            return;
        }
        const rcon1 = await rcon_client_1.Rcon.connect(client.rconCMP);
        const response1 = await rcon1.send(`whitelist remove ${optionsUsername.value}`);
        rcon1.end();
        response.edit({
            content: `
### Response from CMP:
${response1}
### Response from SMP:
disabled`,
        });
    },
};
exports.slashCommand = {
    data: commandData,
    execute: async (client, interaction) => {
        if (interaction.options.data[0].name === "add") {
            console.log(`[SLASH COMMANDS] Executed Subcommand "add" by ${interaction.user.username}`);
            run.add(client, interaction);
        }
        else if (interaction.options.data[0].name === "remove") {
            console.log(`[SLASH COMMANDS] Executed Subcommand "remove" by ${interaction.user.username}`);
            run.remove(client, interaction);
        }
        else
            interaction.reply({
                content: "## <:no:1181140154623213569> An Error Occured! Code #3",
                ephemeral: true,
            });
    },
};
//# sourceMappingURL=whitelist.js.map