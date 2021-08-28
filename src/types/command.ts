import { CommandInteraction } from "discord.js";

export interface ICommand {
  data: any;
  execute: (interaction: CommandInteraction) => void;
}
