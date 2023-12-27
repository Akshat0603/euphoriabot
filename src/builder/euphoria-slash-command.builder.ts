import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption,
} from "discord.js";
import {
  EuphoriaSubCommand,
  Parameter,
  SlashCommandDescriptor,
} from "./slash-command.descriptor";

export class EuphoriaSlashCommandBuilder {
  static build(desc: SlashCommandDescriptor) {
    const commandData = new SlashCommandBuilder()
      .setName(desc.name)
      .setDescription(desc.description)
      .setDefaultMemberPermissions(desc.permission);
    desc.subCommands.forEach((command) => {
      const subCommand = this.buildSubCommand(command);
      commandData.addSubcommand(subCommand);
    });

    return commandData;
  }

  static buildSubCommand(command: EuphoriaSubCommand) {
    const subCommand = new SlashCommandSubcommandBuilder()
      .setName(command.name)
      .setDescription(command.description);
    command.parameters.forEach((parameter) =>
      this.addParameter(parameter, subCommand)
    );
    return subCommand;
  }

  static addParameter(
    parameter: Parameter,
    subCommand: SlashCommandSubcommandBuilder
  ) {
    switch (parameter.type) {
      case "string":
        subCommand.addStringOption(
          new SlashCommandStringOption()
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(parameter.required)
        );
        break;
      case "user":
        subCommand.addUserOption(
          new SlashCommandUserOption()
            .setName(parameter.name)
            .setDescription(parameter.description)
            .setRequired(parameter.required)
        );
        break;
    }
  }
}
