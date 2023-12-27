import { Permissions } from "discord.js";

export interface SlashCommandDescriptor {
  name: string;
  description: string;
  permission: Permissions | bigint | number | null | undefined;
  subCommands: EuphoriaSubCommand[];
}

export interface EuphoriaSubCommand {
  name: string;
  description: string;
  parameters: Parameter[];
}

export interface Parameter {
  type: "user" | "string";
  name: string;
  description: string;
  required: boolean;
}
