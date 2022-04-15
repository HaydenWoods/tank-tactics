import { CommandInteraction } from "discord.js";

import { ControllerParams } from "@/types/controller";

export type CommandController = (
  interaction: CommandInteraction,
  params: ControllerParams
) => Promise<void>;

export type Command = {
  meta: {
    name: string;
    description: string;
    options?: any;
  };
  controller: CommandController;
};
